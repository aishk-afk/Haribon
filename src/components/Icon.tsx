import type { IconType } from "react-icons";
import {
    LuHeart, LuUsers, LuHandshake, LuSprout, LuTrees, LuBird, LuPawPrint,
    LuHeartHandshake, LuRecycle, LuMapPin, LuMail, LuMenu, LuX,
} from "react-icons/lu";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa6";

const iconMap = {
    logo: LuBird,
    donate: LuHeart,
    member: LuUsers,
    partner: LuHandshake,
    volunteer: LuSprout,
    forest: LuTrees,
    species: LuPawPrint,
    people: LuHeartHandshake,
    sustainability: LuRecycle,
    location: LuMapPin,
    email: LuMail,
    menu: LuMenu,
    close: LuX,
    facebook: FaFacebookF,
    instagram: FaInstagram,
    linkedin: FaLinkedinIn,
} satisfies Record<string, IconType>;

export type IconName = keyof typeof iconMap;

const solidIcons: IconName[] = ["facebook", "instagram", "linkedin"];

type Props = {
    name: IconName;
    size?: number;
    badge?: "green" | "white";
    white?: boolean;
};

function Icon({ name, size = 28, badge, white = false }: Props) {
    const Glyph = iconMap[name];
    const glyph = (
        <Glyph
            size={size}
            strokeWidth={solidIcons.includes(name) ? undefined : 1.75}
            className={white ? "icon-white" : undefined}
            aria-hidden="true"
        />
    );

    if (!badge) return glyph;

    const box = Math.round(size * 1.9);
    return (
        <span className={`icon-badge ${badge}`} style={{ width: box, height: box }} aria-hidden="true">
            {glyph}
        </span>
    );
}

export default Icon;