import { AiFillInstagram, AiFillYoutube, AiFillTikTok } from "react-icons/ai";
import { FaSquareFacebook } from "react-icons/fa6";
import { BsFacebook, BsTelegram } from "react-icons/bs";
import { BiLogoLinkedinSquare } from "react-icons/bi";
import { FaFacebookSquare } from "react-icons/fa";

const ICONS_MAP = {
  instagram: AiFillInstagram,
  facebook: FaSquareFacebook,
  youtube: AiFillYoutube,
  telegram: BsTelegram,
  tiktok: AiFillTikTok,
  linkedin: BiLogoLinkedinSquare,
};

export const getSocialIcon = (title) => {
  return ICONS_MAP[title] ?? null;
};
