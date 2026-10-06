export type PageStatus = 'published' | 'draft' | 'archived';

export type ComponentType =
  | 'heading'
  | 'text'
  | 'image'
  | 'button'
  | 'divider'
  | 'spacer'
  | 'section'
  | 'container'
  | 'columns'
  | 'imageText'
  | 'featureCard'
  | 'gallery'
  | 'banner'
  | 'quote'
  | 'contactForm'
  | 'video'
  | 'map'
  | 'accordion';

export interface ComponentStyles {
  textColor?: string;
  backgroundColor?: string;
  fontSize?: 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
  fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  paddingTop?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  paddingRight?: string;
  marginTop?: string;
  marginBottom?: string;
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  borderWidth?: '0' | '1' | '2' | '4';
  borderColor?: string;
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  maxWidth?: string;
  customClass?: string;
}

export interface ComponentContent {
  text?: string;
  headingLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  imageUrl?: string;
  imageAlt?: string;
  caption?: string;
  buttonText?: string;
  buttonUrl?: string;
  buttonVariant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'navy';
  buttonSize?: 'sm' | 'md' | 'lg';
  dividerStyle?: 'solid' | 'dashed' | 'dotted';
  spacerHeight?: string;
  columnsCount?: 2 | 3 | 4;
  imagePosition?: 'left' | 'right';
  badgeText?: string;
  featureTitle?: string;
  featureDescription?: string;
  featureIcon?: string;
  galleryImages?: { url: string; alt: string; caption?: string }[];
  bannerSubtitle?: string;
  bannerCtaText?: string;
  bannerCtaUrl?: string;
  quoteAuthor?: string;
  quoteRole?: string;
  quoteAvatar?: string;
  formTitle?: string;
  formDescription?: string;
  formSubmitText?: string;
  videoUrl?: string;
  mapLocation?: string;
  accordionItems?: { title: string; content: string }[];
  [key: string]: any;
}

export interface ComponentAdvanced {
  customId?: string;
  customCss?: string;
  customClass?: string;
  hideOnMobile?: boolean;
  hideOnDesktop?: boolean;
  animation?: 'none' | 'fade' | 'slide-up' | 'zoom-in';
}

export interface BuilderComponent {
  id: string;
  type: ComponentType;
  label: string;
  content: ComponentContent;
  style: ComponentStyles;
  advanced?: ComponentAdvanced;
  children?: BuilderComponent[];
  columnsData?: BuilderComponent[][];
}

export interface MenuItem {
  id: string;
  label: string;
  slug: string;
  icon?: string;
  isDefault?: boolean;
  order: number;
  components: BuilderComponent[];
}

export interface ClientTheme {
  primaryColor: string;
  sidebarBg: string;
  sidebarText: string;
  fontFamily: string;
  logoUrl?: string;
  logoText: string;
  borderRadius: string;
}

export interface ClientPage {
  id: string;
  title: string;
  clientName: string;
  clientLogo?: string;
  slug: string;
  status: PageStatus;
  createdAt: string;
  lastUpdated: string;
  privateToken: string;
  isUrlActive: boolean;
  urlExpiryDate?: string;
  passwordProtected?: boolean;
  password?: string;
  thumbnailUrl?: string;
  theme: ClientTheme;
  menuItems: MenuItem[];
  activeMenuItemId: string;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  alt: string;
  size: string; // e.g. "1.2 MB"
  bytes: number;
  type: string; // e.g. "image/png"
  dimensions: string; // e.g. "1920x1080"
  uploadedAt: string;
  tags: string[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'success' | 'warning';
}
