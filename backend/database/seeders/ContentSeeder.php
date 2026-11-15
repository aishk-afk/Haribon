<?php

namespace Database\Seeders;

use App\Models\Media;
use App\Models\Page;
use App\Models\Program;
use App\Models\SiteSetting;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

/**
 * Loads the text that was hard-coded in the React site into MySQL, so the CMS starts
 * with the real Haribon content. It uses firstOrCreate, so running it again never
 * overwrites changes an editor already made. Use `migrate:fresh --seed` to reset.
 */
class ContentSeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function () {
            $heroImage = $this->seedHeroImage();

            $this->seedHome($heroImage);
            $this->seedAbout();
            $this->seedDonate();
            $this->seedPrograms();
            $this->seedSettings();
        });
    }

    private function seedHeroImage(): string
    {
        $path = 'uploads/philippine-eagle.jpg';
        $source = __DIR__.'/assets/philippine-eagle.jpg';

        if (! Storage::disk('public')->exists($path)) {
            Storage::disk('public')->put($path, file_get_contents($source));
        }

        Media::firstOrCreate(['path' => $path], [
            'filename' => 'philippine-eagle.jpg',
            'mime_type' => 'image/jpeg',
            'size' => Storage::disk('public')->size($path),
        ]);

        return $path;
    }

    /** @param array<int, array<string, mixed>> $sections */
    private function seedPage(string $slug, string $title, array $sections): void
    {
        $page = Page::firstOrCreate(['slug' => $slug], ['title' => $title, 'status' => 'published']);

        foreach ($sections as $order => $section) {
            $key = $section['section_key'];
            unset($section['section_key']);

            $page->sections()->firstOrCreate(
                ['section_key' => $key],
                $section + ['display_order' => $order + 1],
            );
        }
    }

    private function seedHome(string $heroImage): void
    {
        $this->seedPage('home', 'Home', [
            [
                'section_key' => 'hero',
                'eyebrow' => 'Since 1972',
                'heading' => 'Leading conservation in the Philippines for over 50 years',
                'body' => 'Inspired by the Philippine Eagle, the Haring Ibon, Haribon works with members and communities to protect our shared ecosystems.',
                'image_path' => $heroImage,
                'button_text' => 'Donate now',
                'button_url' => '/donate',
                'button2_text' => 'Our work',
                'button2_url' => '#pillars',
            ],
            ['section_key' => 'actions_intro', 'heading' => 'Ways to take part'],
            [
                'section_key' => 'action_donate', 'icon' => 'donate', 'heading' => 'Donate',
                'body' => 'Support conservation work across the country.', 'button_url' => '/donate',
            ],
            [
                'section_key' => 'action_member', 'icon' => 'member', 'heading' => 'Be a member',
                'body' => 'Join a community of nature defenders.', 'button_url' => 'https://haribon.org.ph/become-a-member/',
            ],
            [
                'section_key' => 'action_partner', 'icon' => 'partner', 'heading' => 'Partner with us',
                'body' => 'Work with Haribon on programs that matter.', 'button_url' => 'https://haribon.org.ph/partner-with-us/',
            ],
            [
                'section_key' => 'action_volunteer', 'icon' => 'volunteer', 'heading' => 'Volunteer',
                'body' => 'Plant trees, watch birds and join cleanups.', 'button_url' => 'https://haribon.org.ph/events-calendar/',
            ],
            ['section_key' => 'stat_founded', 'heading' => '1972', 'body' => 'Year founded'],
            ['section_key' => 'stat_years', 'heading' => '50+', 'body' => 'Years of conservation'],
            ['section_key' => 'stat_pillars', 'heading' => '4', 'body' => 'Pillars of our work'],
            [
                'section_key' => 'pillars_intro', 'heading' => 'Our four pillars',
                'body' => 'Haribon organizes its work around four goals, each with its own programs.',
            ],
            ['section_key' => 'announcements_intro', 'heading' => 'Latest announcements'],
            [
                'section_key' => 'cta',
                'heading' => 'Every contribution helps protect the Philippines’ forests and wildlife',
                'button_text' => 'Donate any amount', 'button_url' => '/donate',
            ],
        ]);
    }

    private function seedAbout(): void
    {
        $this->seedPage('about', 'About Me', [
            [
                'section_key' => 'about_intro',
                'eyebrow' => 'About me',
                'heading' => 'About Me',
                'body' => 'Hi, I\'m Shanta Tuazon, a student developer who enjoys learning and exploring new things.',
            ],
            [
                'section_key' => 'about_name',
                'heading' => 'What the name means',
                'body' => '“Haribon” comes from Haring Ibon, the local name of the Philippine Eagle, which means “king of birds.” The eagle is the national bird of the Philippines and is critically endangered, so it is a fitting symbol for an organization that protects the forests and wildlife it depends on.',
            ],
            [
                'section_key' => 'about_pioneer',
                'heading' => 'The pioneer of Philippine conservation',
                'body' => 'Haribon is the Philippines’ oldest and pioneer environmental conservation organization. Founded in 1972, it has spent more than 50 years protecting forests, species and the communities that live alongside them.',
            ],
            [
                'section_key' => 'about_reasons_intro',
                'heading' => 'Why I chose Haribon',
                'body' => 'These are the four reasons I chose the Haribon Foundation for this project.',
            ],
            [
                'section_key' => 'about_reason_conservation', 'icon' => 'forest',
                'heading' => 'Environmental conservation',
                'body' => 'Protecting forests, wildlife, and natural habitats.',
            ],
            [
                'section_key' => 'about_reason_biodiversity', 'icon' => 'species',
                'heading' => 'Biodiversity protection',
                'body' => 'Helping preserve unique Philippine species, including the Philippine Eagle.',
            ],
            [
                'section_key' => 'about_reason_community', 'icon' => 'people',
                'heading' => 'Community involvement',
                'body' => 'Encouraging people to participate in protecting nature.',
            ],
            [
                'section_key' => 'about_reason_sustainability', 'icon' => 'sustainability',
                'heading' => 'Sustainability',
                'body' => 'Promoting responsible use of natural resources.',
            ],
        ]);
    }

    private function seedDonate(): void
    {
        $this->seedPage('donate', 'Donate', [
            [
                'section_key' => 'donate_intro',
                'eyebrow' => 'Support Haribon',
                'heading' => 'Help protect the Philippines’ forests and wildlife',
                'body' => 'Since 1972, Haribon has championed biodiversity conservation, inspired by the Philippine Eagle. Choose an amount to support that mission.',
            ],
            ['section_key' => 'donate_point_forest', 'icon' => 'forest', 'heading' => 'Protecting forests and critical habitats'],
            ['section_key' => 'donate_point_species', 'icon' => 'species', 'heading' => 'Saving threatened species'],
            ['section_key' => 'donate_point_people', 'icon' => 'people', 'heading' => 'Empowering communities to care for nature'],
            [
                'section_key' => 'donate_card',
                'heading' => 'Make a donation',
                'body' => 'Demo mode: pay with test card 4242 4242 4242 4242, any future date, any CVC. No real money is charged.',
            ],
        ]);
    }

    private function seedPrograms(): void
    {
        $pillars = [
            [
                'title' => 'Conserving Sites & Habitats', 'icon' => 'forest',
                'description' => 'Protecting forests and critical habitats, from the Sierra Madre to the mountains of Panay.',
                'items' => ['Forests for Life', 'Central Sierra Madre', 'Central Panay Mountain Range', 'Project AGOS'],
            ],
            [
                'title' => 'Saving Species', 'icon' => 'species',
                'description' => 'Defending threatened wildlife and stopping the illegal trade that endangers it.',
                'items' => ['Species of Hope', 'Illegal Parrot Trade'],
            ],
            [
                'title' => 'Empowering People', 'icon' => 'people',
                'description' => 'Teaching communities and young people to look after the nature around them.',
                'items' => ['WePhili Project', 'Biodiversity on the Move', 'Junior Sea Guardians'],
            ],
            [
                'title' => 'Encouraging Sustainability', 'icon' => 'sustainability',
                'description' => 'Building membership, volunteering and advocacy that keep conservation going.',
                'items' => ['Membership & Volunteer Program', 'NbS & BDFE', 'Communications & Advocacy'],
            ],
        ];

        foreach ($pillars as $order => $pillar) {
            Program::firstOrCreate(['title' => $pillar['title']], $pillar + [
                'status' => 'published',
                'published_at' => now(),
                'display_order' => $order + 1,
            ]);
        }
    }

    private function seedSettings(): void
    {
        $settings = [
            'org_name' => 'Haribon Foundation',
            'footer_description' => 'Leading conservation in the Philippines since 1972.',
            'contact_address' => 'Manila Observatory Bldg, Rm 212, Ateneo de Manila University, Katipunan Avenue, Loyola Heights, Quezon City 1108',
            'contact_email' => 'hello@haribon.org.ph',
            'facebook_url' => 'https://www.facebook.com/GoHaribon',
            'instagram_url' => 'https://www.instagram.com/goharibon/',
            'linkedin_url' => 'https://ph.linkedin.com/company/goharibon',
            'footer_notice' => '© 2026 Student project inspired by the Haribon Foundation. Donations on this site run in Stripe test mode and no real money is collected.',
            'credits_note' => 'Icons from Lucide and Font Awesome Free, via react-icons.',
        ];

        foreach ($settings as $key => $value) {
            SiteSetting::firstOrCreate(['setting_key' => $key], ['setting_value' => $value]);
        }
    }
}
