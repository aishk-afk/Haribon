<?php

namespace Tests\Feature;

use App\Models\Announcement;
use App\Models\Media;
use App\Models\Page;
use App\Models\PageSection;
use App\Models\Program;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CmsApiTest extends TestCase
{
    use RefreshDatabase;

    private const PNG = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

    private function admin(): User
    {
        $user = User::factory()->create(['is_admin' => true]);
        Sanctum::actingAs($user);

        return $user;
    }

    private function seedContent(): void
    {
        Storage::fake('public');
        $this->seed();
    }

    // ---------------------------------------------------------------- public API

    public function test_seeder_loads_the_existing_site_content(): void
    {
        $this->seedContent();

        $home = $this->getJson('/api/pages/home')->assertOk()->json('data');
        $keys = collect($home['sections'])->pluck('section_key');

        $this->assertTrue($keys->contains('hero'));
        $this->assertSame('Leading conservation in the Philippines for over 50 years', collect($home['sections'])->firstWhere('section_key', 'hero')['heading']);
        $this->assertNotNull(collect($home['sections'])->firstWhere('section_key', 'hero')['image_url']);

        $about = $this->getJson('/api/pages/about')->assertOk()->json('data.sections');
        $reasons = collect($about)->filter(fn ($s) => str_starts_with($s['section_key'], 'about_reason_'));
        $this->assertCount(4, $reasons);
        $this->assertSame(['Environmental conservation', 'Biodiversity protection', 'Community involvement', 'Sustainability'], $reasons->pluck('heading')->values()->all());
        $this->assertSame(['forest', 'species', 'people', 'sustainability'], $reasons->pluck('icon')->values()->all());

        $this->getJson('/api/programs')->assertOk()->assertJsonCount(4, 'data');
        $this->getJson('/api/settings')->assertOk()->assertJsonPath('data.org_name', 'Haribon Foundation');
        $this->assertDatabaseHas('media', ['path' => 'uploads/philippine-eagle.jpg']);
    }

    public function test_seeder_can_run_twice_without_duplicating_or_overwriting_edits(): void
    {
        $this->seedContent();
        PageSection::where('section_key', 'hero')->update(['heading' => 'Edited by an administrator']);

        $this->seed();

        $this->assertSame(1, PageSection::where('section_key', 'hero')->count());
        $this->assertSame('Edited by an administrator', PageSection::where('section_key', 'hero')->value('heading'));
        $this->assertSame(4, Program::count());
    }

    public function test_public_api_only_returns_published_content(): void
    {
        Page::create(['title' => 'Draft', 'slug' => 'secret', 'status' => 'draft']);
        Announcement::create(['title' => 'Live', 'content' => 'x', 'status' => 'published', 'published_at' => now()->subMinute()]);
        Announcement::create(['title' => 'Hidden', 'content' => 'x', 'status' => 'draft']);
        Announcement::create(['title' => 'Future', 'content' => 'x', 'status' => 'published', 'published_at' => now()->addDay()]);
        Program::create(['title' => 'Draft program', 'status' => 'draft']);

        $this->getJson('/api/pages/secret')->assertNotFound();
        $this->getJson('/api/pages')->assertOk()->assertJsonCount(0, 'data');
        $this->getJson('/api/announcements')->assertOk()->assertJsonCount(1, 'data')->assertJsonPath('data.0.title', 'Live');
        $this->getJson('/api/programs')->assertOk()->assertJsonCount(0, 'data');

        $hidden = Announcement::where('title', 'Hidden')->first();
        $this->getJson("/api/announcements/{$hidden->id}")->assertNotFound();
    }

    public function test_unknown_api_routes_return_json(): void
    {
        $this->getJson('/api/does-not-exist')->assertNotFound()->assertJsonStructure(['message']);
    }

    // ---------------------------------------------------------------- security

    public function test_admin_endpoints_reject_guests(): void
    {
        $this->getJson('/api/admin/dashboard')->assertUnauthorized();
        $this->postJson('/api/admin/announcements', ['title' => 'x', 'content' => 'y', 'status' => 'published'])->assertUnauthorized();
        $this->putJson('/api/admin/settings', ['settings' => ['org_name' => 'Hacked']])->assertUnauthorized();
        $this->postJson('/api/admin/media')->assertUnauthorized();
        $this->deleteJson('/api/admin/pages/1')->assertUnauthorized();
        $this->assertDatabaseCount('announcements', 0);
    }

    public function test_admin_endpoints_reject_non_admin_users(): void
    {
        Sanctum::actingAs(User::factory()->create(['is_admin' => false]));

        $this->getJson('/api/admin/dashboard')->assertForbidden();
        $this->postJson('/api/admin/announcements', ['title' => 'x', 'content' => 'y', 'status' => 'published'])->assertForbidden();
    }

    public function test_login_logout_flow(): void
    {
        $admin = User::factory()->create(['is_admin' => true, 'password' => 'correct-horse']);
        $editor = User::factory()->create(['is_admin' => false, 'password' => 'correct-horse']);
        $headers = ['Referer' => 'http://localhost:5173/admin', 'Origin' => 'http://localhost:5173'];

        $this->withHeaders($headers)->postJson('/api/login', ['email' => $admin->email, 'password' => 'wrong'])
            ->assertStatus(422)->assertJsonValidationErrors('email');

        $this->withHeaders($headers)->postJson('/api/login', ['email' => $editor->email, 'password' => 'correct-horse'])
            ->assertStatus(422);
        $this->assertGuest('web');

        $this->withHeaders($headers)->postJson('/api/login', ['email' => $admin->email, 'password' => 'correct-horse'])
            ->assertOk()->assertJsonPath('data.email', $admin->email)->assertJsonMissingPath('data.password');
        $this->assertAuthenticatedAs($admin, 'web');

        $this->withHeaders($headers)->postJson('/api/logout')->assertOk();
        $this->assertGuest('web');
    }

    public function test_passwords_are_stored_hashed(): void
    {
        $user = User::factory()->create(['password' => 'plain-text-password']);

        $this->assertNotSame('plain-text-password', $user->fresh()->password);
        $this->assertTrue(password_verify('plain-text-password', $user->fresh()->password));
    }

    public function test_create_admin_command(): void
    {
        $this->artisan('cms:create-admin', ['--name' => 'Sha', '--email' => 'sha@example.com', '--password' => 'longenough1'])
            ->assertSuccessful();

        $user = User::where('email', 'sha@example.com')->firstOrFail();
        $this->assertTrue($user->is_admin);
        $this->assertNotSame('longenough1', $user->password);

        $this->artisan('cms:create-admin', ['--name' => 'Sha', '--email' => 'bad@example.com', '--password' => 'short'])
            ->assertFailed();
        $this->assertDatabaseMissing('users', ['email' => 'bad@example.com']);
    }

    // ---------------------------------------------------------------- CMS: pages and sections

    public function test_editing_a_section_changes_the_public_page(): void
    {
        $this->seedContent();
        $this->admin();
        $hero = PageSection::where('section_key', 'hero')->firstOrFail();

        $payload = $hero->only(['section_key', 'eyebrow', 'body', 'icon', 'button_text', 'button_url', 'button2_text', 'button2_url', 'display_order', 'image_path']);
        $payload['heading'] = 'A brand new headline';

        $this->putJson("/api/admin/sections/{$hero->id}", $payload)->assertOk()->assertJsonPath('data.heading', 'A brand new headline');

        $this->assertDatabaseHas('page_sections', ['id' => $hero->id, 'heading' => 'A brand new headline']);

        $public = collect($this->getJson('/api/pages/home')->json('data.sections'))->firstWhere('section_key', 'hero');
        $this->assertSame('A brand new headline', $public['heading']);
    }

    public function test_section_validation_blocks_script_links_and_unknown_images(): void
    {
        $this->seedContent();
        $this->admin();
        $page = Page::where('slug', 'home')->firstOrFail();

        $base = ['section_key' => 'new_block', 'heading' => 'Hello'];

        $this->postJson("/api/admin/pages/{$page->id}/sections", $base + ['button_url' => 'javascript:alert(1)'])
            ->assertStatus(422)->assertJsonValidationErrors('button_url');
        $this->postJson("/api/admin/pages/{$page->id}/sections", $base + ['image_path' => '../../.env'])
            ->assertStatus(422)->assertJsonValidationErrors('image_path');
        $this->postJson("/api/admin/pages/{$page->id}/sections", $base + ['icon' => 'not-an-icon'])
            ->assertStatus(422)->assertJsonValidationErrors('icon');
        $this->postJson("/api/admin/pages/{$page->id}/sections", ['heading' => 'No key'])
            ->assertStatus(422)->assertJsonValidationErrors('section_key');

        $this->postJson("/api/admin/pages/{$page->id}/sections", $base + ['button_url' => '/donate'])->assertCreated();
        // duplicate key on the same page is rejected
        $this->postJson("/api/admin/pages/{$page->id}/sections", $base)->assertStatus(422)->assertJsonValidationErrors('section_key');
    }

    public function test_sections_can_be_deleted(): void
    {
        $this->seedContent();
        $this->admin();
        $section = PageSection::where('section_key', 'stat_years')->firstOrFail();

        $this->deleteJson("/api/admin/sections/{$section->id}")->assertOk();
        $this->assertDatabaseMissing('page_sections', ['id' => $section->id]);
    }

    public function test_core_pages_cannot_be_deleted_or_renamed_but_can_be_unpublished(): void
    {
        $this->seedContent();
        $this->admin();
        $home = Page::where('slug', 'home')->firstOrFail();

        $this->deleteJson("/api/admin/pages/{$home->id}")->assertStatus(422);
        $this->assertDatabaseHas('pages', ['slug' => 'home']);

        $this->putJson("/api/admin/pages/{$home->id}", ['title' => 'Home', 'slug' => 'start', 'status' => 'published'])->assertOk();
        $this->assertSame('home', $home->fresh()->slug);

        $this->patchJson("/api/admin/pages/{$home->id}/status", ['status' => 'draft'])->assertOk();
        $this->getJson('/api/pages/home')->assertNotFound();
        $this->patchJson("/api/admin/pages/{$home->id}/status", ['status' => 'published'])->assertOk();
        $this->getJson('/api/pages/home')->assertOk();
    }

    public function test_custom_pages_can_be_created_and_deleted(): void
    {
        $this->admin();

        $id = $this->postJson('/api/admin/pages', ['title' => 'Mission', 'slug' => 'mission', 'status' => 'published'])
            ->assertCreated()->json('data.id');
        $this->postJson('/api/admin/pages', ['title' => 'Again', 'slug' => 'mission', 'status' => 'draft'])
            ->assertStatus(422)->assertJsonValidationErrors('slug');
        $this->postJson('/api/admin/pages', ['title' => 'Bad slug', 'slug' => 'Not A Slug!', 'status' => 'draft'])
            ->assertStatus(422);

        $this->getJson('/api/pages/mission')->assertOk();
        $this->deleteJson("/api/admin/pages/{$id}")->assertOk();
        $this->getJson('/api/pages/mission')->assertNotFound();
    }

    // ---------------------------------------------------------------- CMS: announcements and programs

    public function test_announcement_crud_and_publish_flow(): void
    {
        $this->admin();

        $id = $this->postJson('/api/admin/announcements', ['title' => 'Tree planting day', 'content' => "Join us.\n\nBring water.", 'status' => 'published'])
            ->assertCreated()->assertJsonPath('data.title', 'Tree planting day')->json('data.id');

        $this->assertNotNull(Announcement::find($id)->published_at, 'publishing stamps a date');
        $this->getJson('/api/announcements')->assertJsonCount(1, 'data');

        $this->putJson("/api/admin/announcements/{$id}", ['title' => 'Tree planting day (moved)', 'content' => 'New date.', 'status' => 'published'])->assertOk();
        $this->getJson("/api/announcements/{$id}")->assertOk()->assertJsonPath('data.title', 'Tree planting day (moved)');

        $this->patchJson("/api/admin/announcements/{$id}/status", ['status' => 'draft'])->assertOk();
        $this->getJson('/api/announcements')->assertJsonCount(0, 'data');
        $this->getJson('/api/admin/announcements')->assertOk()->assertJsonCount(1, 'data');

        $this->deleteJson("/api/admin/announcements/{$id}")->assertOk();
        $this->assertDatabaseMissing('announcements', ['id' => $id]);
    }

    public function test_announcement_validation(): void
    {
        $this->admin();

        $this->postJson('/api/admin/announcements', [])->assertStatus(422)->assertJsonValidationErrors(['title', 'content', 'status']);
        $this->postJson('/api/admin/announcements', ['title' => 'x', 'content' => 'y', 'status' => 'archived'])
            ->assertStatus(422)->assertJsonValidationErrors('status');
    }

    public function test_program_crud(): void
    {
        $this->admin();

        $id = $this->postJson('/api/admin/programs', [
            'title' => 'New pillar', 'description' => 'About it', 'icon' => 'forest',
            'items' => ['One', 'Two'], 'status' => 'published',
        ])->assertCreated()->assertJsonPath('data.items.1', 'Two')->json('data.id');

        $this->getJson('/api/programs')->assertJsonCount(1, 'data');

        $this->putJson("/api/admin/programs/{$id}", ['title' => 'Renamed', 'items' => ['Only one'], 'status' => 'published'])
            ->assertOk()->assertJsonPath('data.title', 'Renamed');
        $this->postJson('/api/admin/programs', ['title' => 'x', 'status' => 'published', 'icon' => 'bad'])->assertStatus(422);

        $this->deleteJson("/api/admin/programs/{$id}")->assertOk();
        $this->getJson('/api/programs')->assertJsonCount(0, 'data');
    }

    // ---------------------------------------------------------------- CMS: media

    public function test_valid_image_upload_is_stored_and_can_be_assigned_then_removed(): void
    {
        Storage::fake('public');
        $this->admin();
        $page = Page::create(['title' => 'Home', 'slug' => 'home', 'status' => 'published']);

        $file = UploadedFile::fake()->createWithContent('eagle.png', base64_decode(self::PNG));
        $media = $this->postJson('/api/admin/media', ['file' => $file])->assertCreated()->json('data');

        Storage::disk('public')->assertExists($media['path']);
        $this->assertStringStartsWith('/storage/uploads/', $media['url']);
        $this->assertNotSame('eagle.png', basename($media['path']), 'stored under a random name');

        $section = $this->postJson("/api/admin/pages/{$page->id}/sections", ['section_key' => 'hero', 'heading' => 'Hi', 'image_path' => $media['path']])
            ->assertCreated()->json('data');
        $this->assertSame($media['url'], $section['image_url']);

        $this->deleteJson("/api/admin/media/{$media['id']}")->assertOk();
        Storage::disk('public')->assertMissing($media['path']);
        $this->assertNull(PageSection::find($section['id'])->image_path);
    }

    /** A real uploaded file on disk, so Laravel inspects the actual contents (not just the name). */
    private function realUpload(string $name, string $content, string $claimedMime): UploadedFile
    {
        $path = tempnam(sys_get_temp_dir(), 'upl');
        file_put_contents($path, $content);

        return new UploadedFile($path, $name, $claimedMime, null, true);
    }

    public function test_invalid_uploads_are_rejected(): void
    {
        Storage::fake('public');
        $this->admin();

        $attempts = [
            'php script renamed to .jpg' => $this->realUpload('shell.jpg', '<?php system($_GET["c"]); ?>', 'image/jpeg'),
            'text renamed to .png' => $this->realUpload('fake.png', 'this is not really a png', 'image/png'),
            'svg with a script' => $this->realUpload('logo.svg', '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>', 'image/svg+xml'),
            'php file' => $this->realUpload('shell.php', '<?php echo 1;', 'application/x-php'),
        ];

        foreach ($attempts as $label => $file) {
            $this->postJson('/api/admin/media', ['file' => $file])
                ->assertStatus(422)
                ->assertJsonValidationErrors('file', responseKey: 'errors');
        }

        $this->postJson('/api/admin/media', [])->assertStatus(422);

        $this->assertSame(0, Media::count());
        $this->assertSame([], Storage::disk('public')->allFiles());
    }

    public function test_oversized_images_are_rejected(): void
    {
        Storage::fake('public');
        $this->admin();

        $big = UploadedFile::fake()->createWithContent('big.png', base64_decode(self::PNG))->size(5000);

        $this->postJson('/api/admin/media', ['file' => $big])->assertStatus(422)->assertJsonValidationErrors('file');
    }

    // ---------------------------------------------------------------- CMS: settings and dashboard

    public function test_settings_update_is_whitelisted_and_validated(): void
    {
        $this->admin();

        $this->putJson('/api/admin/settings', ['settings' => [
            'org_name' => 'Haribon Foundation Inc.', 'contact_email' => 'info@example.org',
            'facebook_url' => 'https://facebook.com/example', 'evil_key' => 'ignored',
        ]])->assertOk()->assertJsonPath('data.org_name', 'Haribon Foundation Inc.');

        $this->assertDatabaseMissing('site_settings', ['setting_key' => 'evil_key']);
        $this->getJson('/api/settings')->assertJsonPath('data.contact_email', 'info@example.org');

        $this->putJson('/api/admin/settings', ['settings' => ['org_name' => 'X', 'contact_email' => 'nope']])
            ->assertStatus(422)->assertJsonValidationErrors('settings.contact_email');
        $this->putJson('/api/admin/settings', ['settings' => ['org_name' => '']])
            ->assertStatus(422)->assertJsonValidationErrors('settings.org_name');
    }

    public function test_dashboard_counts(): void
    {
        $this->seedContent();
        $this->admin();

        $this->getJson('/api/admin/dashboard')->assertOk()
            ->assertJsonPath('data.pages.total', 3)
            ->assertJsonPath('data.programs.published', 4)
            ->assertJsonPath('data.media', 1);
    }
}
