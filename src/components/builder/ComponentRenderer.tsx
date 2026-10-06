'use client';

import React, { useState } from 'react';
import { BuilderComponent } from '@/types';
import {
  Sparkles,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ChevronDown,
  Send,
  MapPin,
  Play,
  ArrowRight,
  Quote as QuoteIcon,
  Maximize2
} from 'lucide-react';

interface ComponentRendererProps {
  component: BuilderComponent;
  isEditor?: boolean;
  onChildClick?: (id: string) => void;
  selectedComponentId?: string | null;
}

export default function ComponentRenderer({
  component,
  isEditor = false,
  onChildClick,
  selectedComponentId
}: ComponentRendererProps) {
  const { type, content, style, advanced } = component;
  const [activeAccordion, setActiveAccordion] = useState<number | null>(0);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  // Style helpers
  const getStyleObject = (): React.CSSProperties => {
    const s: React.CSSProperties = {};
    if (style.textColor) s.color = style.textColor;
    if (style.backgroundColor) s.backgroundColor = style.backgroundColor;
    if (style.paddingTop) s.paddingTop = style.paddingTop;
    if (style.paddingBottom) s.paddingBottom = style.paddingBottom;
    if (style.paddingLeft) s.paddingLeft = style.paddingLeft;
    if (style.paddingRight) s.paddingRight = style.paddingRight;
    if (style.marginTop) s.marginTop = style.marginTop;
    if (style.marginBottom) s.marginBottom = style.marginBottom;
    if (style.borderColor) s.borderColor = style.borderColor;
    if (style.maxWidth) s.maxWidth = style.maxWidth;
    return s;
  };

  const getBorderRadiusClass = () => {
    switch (style.borderRadius) {
      case 'none': return 'rounded-none';
      case 'sm': return 'rounded-md';
      case 'md': return 'rounded-xl';
      case 'lg': return 'rounded-2xl';
      case 'xl': return 'rounded-3xl';
      case '2xl': return 'rounded-[2rem]';
      case 'full': return 'rounded-full';
      default: return 'rounded-xl';
    }
  };

  const getShadowClass = () => {
    switch (style.shadow) {
      case 'none': return 'shadow-none';
      case 'sm': return 'shadow-sm';
      case 'md': return 'shadow-md';
      case 'lg': return 'shadow-lg';
      case 'xl': return 'shadow-xl';
      case '2xl': return 'shadow-2xl';
      default: return '';
    }
  };

  const getBorderClass = () => {
    switch (style.borderWidth) {
      case '1': return 'border border-navy-200';
      case '2': return 'border-2 border-navy-200';
      case '4': return 'border-4 border-navy-200';
      default: return '';
    }
  };

  const getTextAlignClass = () => {
    switch (style.textAlign) {
      case 'center': return 'text-center';
      case 'right': return 'text-right';
      case 'justify': return 'text-justify';
      default: return 'text-left';
    }
  };

  const commonClasses = `${getBorderRadiusClass()} ${getShadowClass()} ${getBorderClass()} ${getTextAlignClass()} ${
    advanced?.customClass || ''
  }`;

  // Rendering switch
  switch (type) {
    case 'heading': {
      const level = content.headingLevel || 'h2';
      const headingText = content.text || 'Heading Title';
      const sizeClasses = {
        h1: 'text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight',
        h2: 'text-2xl sm:text-3xl font-bold tracking-tight',
        h3: 'text-xl sm:text-2xl font-bold',
        h4: 'text-lg sm:text-xl font-semibold',
        h5: 'text-base font-semibold',
        h6: 'text-sm font-semibold uppercase tracking-wider',
      }[level];

      const HeadingTag = (content.headingLevel || 'h2') as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
      return (
        <HeadingTag
          style={getStyleObject()}
          className={`${sizeClasses} ${commonClasses} text-navy-900 leading-tight`}
        >
          {headingText}
        </HeadingTag>
      );
    }

    case 'text': {
      return (
        <p
          style={getStyleObject()}
          className={`text-base leading-relaxed text-navy-600 ${commonClasses}`}
        >
          {content.text || 'Add your paragraph description here.'}
        </p>
      );
    }

    case 'image': {
      return (
        <div style={getStyleObject()} className={`overflow-hidden ${commonClasses}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={
              content.imageUrl ||
              'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80'
            }
            alt={content.imageAlt || 'Image content'}
            className="w-full h-auto object-cover rounded-inherit transition-transform duration-300 hover:scale-[1.01]"
          />
          {content.caption && (
            <p className="text-xs text-navy-500 mt-2 text-center italic">{content.caption}</p>
          )}
        </div>
      );
    }

    case 'button': {
      const variantClasses = {
        primary: 'bg-primary-600 hover:bg-primary-700 text-white shadow-md shadow-primary-600/20',
        secondary: 'bg-navy-800 hover:bg-navy-900 text-white shadow-md',
        outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50',
        ghost: 'text-primary-600 hover:bg-primary-50',
        navy: 'bg-navy-950 hover:bg-navy-900 text-white shadow-lg'
      }[content.buttonVariant || 'primary'];

      return (
        <div style={getStyleObject()} className={getTextAlignClass()}>
          <a
            href={isEditor ? '#!' : content.buttonUrl || '#'}
            onClick={(e) => isEditor && e.preventDefault()}
            className={`inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold text-sm rounded-xl transition-all active:scale-95 ${variantClasses} ${commonClasses}`}
          >
            <span>{content.buttonText || 'Learn More'}</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      );
    }

    case 'divider': {
      const borderStyle = content.dividerStyle || 'solid';
      return (
        <div style={getStyleObject()} className="py-4">
          <hr
            className="border-navy-200"
            style={{
              borderTopStyle: borderStyle,
              borderTopWidth: style.borderWidth ? `${style.borderWidth}px` : '1px'
            }}
          />
        </div>
      );
    }

    case 'spacer': {
      const height = content.spacerHeight || '32px';
      return <div style={{ height, ...getStyleObject() }} className="w-full" />;
    }

    case 'banner': {
      return (
        <div
          style={{
            ...getStyleObject(),
            backgroundImage: content.imageUrl
              ? `linear-gradient(to right, rgba(15, 23, 42, 0.92), rgba(15, 23, 42, 0.7)), url(${content.imageUrl})`
              : 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
          className={`relative text-white p-8 sm:p-12 overflow-hidden shadow-xl ${commonClasses}`}
        >
          <div className="max-w-2xl space-y-3 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-500/20 text-blue-300 text-xs font-semibold border border-primary-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Confidential Briefing</span>
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              {content.text || 'Transforming Enterprise Architecture'}
            </h2>
            <p className="text-navy-300 text-sm sm:text-base leading-relaxed">
              {content.bannerSubtitle ||
                'High-performance distributed systems engineered for extreme security, global compliance, and effortless scale.'}
            </p>
            {content.bannerCtaText && (
              <div className="pt-2">
                <a
                  href={isEditor ? '#!' : content.bannerCtaUrl || '#'}
                  onClick={(e) => isEditor && e.preventDefault()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-primary-600/30 transition-all"
                >
                  <span>{content.bannerCtaText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>
        </div>
      );
    }

    case 'imageText': {
      const isRight = content.imagePosition === 'right';
      return (
        <div
          style={getStyleObject()}
          className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-center ${commonClasses}`}
        >
          <div className={`space-y-4 ${isRight ? 'order-1' : 'order-2'}`}>
            <span className="text-xs font-bold uppercase tracking-wider text-primary-600">
              {content.badgeText || 'Strategic Architecture'}
            </span>
            <h3 className="text-2xl font-bold text-navy-900 tracking-tight">
              {content.text || 'Seamless Enterprise Integration'}
            </h3>
            <p className="text-sm text-navy-600 leading-relaxed">
              {content.featureDescription ||
                'Integrate smoothly with your current cloud infrastructure while upholding stringent zero-trust data access controls and microsegmentation.'}
            </p>
            {content.buttonText && (
              <a
                href={isEditor ? '#!' : '#'}
                onClick={(e) => isEditor && e.preventDefault()}
                className="inline-flex items-center gap-2 text-xs font-bold text-primary-600 hover:text-blue-800 transition-colors"
              >
                <span>{content.buttonText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
          <div className={`overflow-hidden rounded-2xl ${isRight ? 'order-2' : 'order-1'}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={
                content.imageUrl ||
                'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'
              }
              alt="Feature preview"
              className="w-full h-auto object-cover rounded-2xl shadow-md hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      );
    }

    case 'featureCard': {
      return (
        <div
          style={getStyleObject()}
          className={`p-6 bg-white border border-navy-200/80 rounded-2xl shadow-soft hover:shadow-card transition-all ${commonClasses}`}
        >
          <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          {content.badgeText && (
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-primary-100 text-primary-700 text-[10px] font-bold uppercase tracking-wider mb-2">
              {content.badgeText}
            </span>
          )}
          <h4 className="text-lg font-bold text-navy-900 mb-2">
            {content.featureTitle || 'Enterprise Security Standard'}
          </h4>
          <p className="text-xs text-navy-600 leading-relaxed">
            {content.featureDescription ||
              'Certified compliance across SOC2 Type II, ISO27001, and HIPAA with continuous telemetry.'}
          </p>
        </div>
      );
    }

    case 'gallery': {
      const images = content.galleryImages || [
        {
          url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
          alt: 'Skyscraper architecture'
        },
        {
          url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
          alt: 'Meeting room'
        },
        {
          url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
          alt: 'Dashboard analytics'
        }
      ];

      return (
        <div style={getStyleObject()} className={`space-y-3 ${commonClasses}`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((img, idx) => (
              <div
                key={idx}
                onClick={() => !isEditor && setActiveImageIndex(idx)}
                className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-navy-100 cursor-pointer border border-navy-200 shadow-sm"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt={img.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-navy-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <Maximize2 className="w-5 h-5" />
                </div>
                {img.caption && (
                  <div className="absolute bottom-0 inset-x-0 p-2 bg-navy-950/70 text-white text-[11px] truncate">
                    {img.caption}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Lightbox zoom modal */}
          {activeImageIndex !== null && (
            <div
              onClick={() => setActiveImageIndex(null)}
              className="fixed inset-0 z-50 bg-navy-950/90 flex items-center justify-center p-4 backdrop-blur-md"
            >
              <div className="max-w-4xl max-h-[90vh] relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={images[activeImageIndex]?.url}
                  alt={images[activeImageIndex]?.alt}
                  className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl"
                />
                <p className="text-white text-center mt-3 text-sm">
                  {images[activeImageIndex]?.caption || images[activeImageIndex]?.alt}
                </p>
              </div>
            </div>
          )}
        </div>
      );
    }

    case 'quote': {
      return (
        <div
          style={getStyleObject()}
          className={`p-6 sm:p-8 bg-gradient-to-br from-navy-900 to-navy-950 text-white rounded-3xl shadow-xl relative overflow-hidden ${commonClasses}`}
        >
          <QuoteIcon className="w-12 h-12 text-primary-500/20 absolute -top-2 -left-2 rotate-180" />
          <div className="relative z-10 space-y-4">
            <p className="text-base sm:text-lg font-medium leading-relaxed italic text-navy-100">
              &ldquo;{content.text || 'This deployment delivered exceptional acceleration across our regional infrastructure.'}&rdquo;
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="w-10 h-10 rounded-full bg-primary-600 text-white font-bold flex items-center justify-center text-xs ring-2 ring-primary-400/30">
                {content.quoteAuthor ? content.quoteAuthor.charAt(0) : 'E'}
              </div>
              <div>
                <p className="text-sm font-bold text-white">{content.quoteAuthor || 'Dr. Elena Rostova'}</p>
                <p className="text-xs text-blue-300">{content.quoteRole || 'Chief Scientific Officer'}</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    case 'contactForm': {
      return (
        <div
          style={getStyleObject()}
          className={`p-6 sm:p-8 bg-white border border-navy-200/80 rounded-3xl shadow-soft ${commonClasses}`}
        >
          <div className="space-y-1 mb-6">
            <h3 className="text-xl font-bold text-navy-900">
              {content.formTitle || 'Confidential Client Inquiries'}
            </h3>
            <p className="text-xs text-navy-500">
              {content.formDescription ||
                'Transmit messages directly to our executive solutions architects.'}
            </p>
          </div>

          {formSubmitted ? (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2 animate-fade-in">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-emerald-900">Message Transmitted Securely</h4>
              <p className="text-xs text-emerald-700">
                Our engagement director will review your submission and respond within 4 business hours.
              </p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setFormSubmitted(true);
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-navy-700 uppercase tracking-wider mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Jane Doe"
                    className="w-full text-xs px-3.5 py-2.5 bg-navy-50 border border-navy-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/30 text-navy-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-navy-700 uppercase tracking-wider mb-1">
                    Work Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="jane@company.com"
                    className="w-full text-xs px-3.5 py-2.5 bg-navy-50 border border-navy-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/30 text-navy-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-navy-700 uppercase tracking-wider mb-1">
                  Subject / Requirement
                </label>
                <input
                  type="text"
                  required
                  placeholder="Phase II Technical Integration Review"
                  className="w-full text-xs px-3.5 py-2.5 bg-navy-50 border border-navy-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/30 text-navy-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-navy-700 uppercase tracking-wider mb-1">
                  Secure Message
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide any specific requirements or scheduling windows..."
                  className="w-full text-xs px-3.5 py-2.5 bg-navy-50 border border-navy-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/30 text-navy-900 resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold shadow-md shadow-primary-600/20 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{content.formSubmitText || 'Submit Message'}</span>
              </button>
            </form>
          )}
        </div>
      );
    }

    case 'accordion': {
      const items = content.accordionItems || [
        {
          title: 'What encryption protocols protect our data stream?',
          content: 'All communications are fortified with TLS 1.3 encryption and automated HSM key management.'
        },
        {
          title: 'How quickly can multi-region redundancy be enabled?',
          content: 'Active-active redundancy across global cloud zones takes less than 24 hours to configure.'
        }
      ];

      return (
        <div style={getStyleObject()} className={`space-y-2.5 ${commonClasses}`}>
          {items.map((item, idx) => {
            const isOpen = activeAccordion === idx;
            return (
              <div
                key={idx}
                className="bg-white border border-navy-200/80 rounded-2xl overflow-hidden shadow-soft transition-all"
              >
                <button
                  type="button"
                  onClick={() => setActiveAccordion(isOpen ? null : idx)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-navy-50/80 transition-colors"
                >
                  <span className="text-xs sm:text-sm font-bold text-navy-900">{item.title}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-navy-400 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-primary-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-navy-600 border-t border-navy-100 leading-relaxed animate-fade-in">
                    {item.content}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      );
    }

    case 'video': {
      return (
        <div style={getStyleObject()} className={`overflow-hidden rounded-2xl shadow-lg ${commonClasses}`}>
          <div className="aspect-video bg-navy-950 flex flex-col items-center justify-center text-white relative group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"
              alt="Video thumbnail"
              className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="relative z-10 w-16 h-16 rounded-full bg-primary-600/90 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
              <Play className="w-6 h-6 fill-white ml-0.5" />
            </div>
            <p className="relative z-10 text-xs font-semibold mt-3 text-navy-200">
              {content.videoUrl || 'Interactive Product Demonstration Walkthrough'}
            </p>
          </div>
        </div>
      );
    }

    case 'map': {
      return (
        <div style={getStyleObject()} className={`overflow-hidden rounded-2xl border border-navy-200 shadow-md ${commonClasses}`}>
          <div className="h-64 bg-navy-100 flex flex-col items-center justify-center relative">
            {/* Styled Map Background */}
            <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] opacity-70"></div>
            <div className="relative z-10 flex flex-col items-center text-center p-4">
              <div className="w-12 h-12 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg animate-bounce">
                <MapPin className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-navy-900 mt-2">
                {content.mapLocation || 'Global Enterprise Headquarters'}
              </p>
              <p className="text-xs text-navy-500">100 Innovation Parkway, Suite 400, Tech City</p>
            </div>
          </div>
        </div>
      );
    }

    case 'section':
    case 'container': {
      return (
        <div
          style={getStyleObject()}
          className={`p-6 bg-navy-50/50 border border-dashed border-navy-300/80 rounded-2xl ${commonClasses}`}
        >
          {component.children && component.children.length > 0 ? (
            <div className="space-y-4">
              {component.children.map((child) => (
                <ComponentRenderer
                  key={child.id}
                  component={child}
                  isEditor={isEditor}
                  onChildClick={onChildClick}
                  selectedComponentId={selectedComponentId}
                />
              ))}
            </div>
          ) : (
            <div className="py-6 text-center text-xs text-navy-400 font-medium">
              Container Container — Drop components inside
            </div>
          )}
        </div>
      );
    }

    case 'columns': {
      const colCount = content.columnsCount || 2;
      const gridClass = {
        2: 'grid-cols-1 md:grid-cols-2',
        3: 'grid-cols-1 md:grid-cols-3',
        4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4'
      }[colCount];

      return (
        <div style={getStyleObject()} className={`grid ${gridClass} gap-4 ${commonClasses}`}>
          {Array.from({ length: colCount }).map((_, colIdx) => {
            const colChildren = component.columnsData ? component.columnsData[colIdx] : [];
            return (
              <div
                key={colIdx}
                className="p-4 bg-white/70 border border-dashed border-navy-200 rounded-xl min-h-[100px] flex flex-col justify-center"
              >
                {colChildren && colChildren.length > 0 ? (
                  colChildren.map((c) => (
                    <ComponentRenderer
                      key={c.id}
                      component={c}
                      isEditor={isEditor}
                      onChildClick={onChildClick}
                      selectedComponentId={selectedComponentId}
                    />
                  ))
                ) : (
                  <p className="text-center text-[11px] text-navy-400 font-medium">Column {colIdx + 1}</p>
                )}
              </div>
            );
          })}
        </div>
      );
    }

    default:
      return (
        <div className="p-4 bg-navy-100 rounded-xl text-xs text-navy-500">
          Unknown component type: {type}
        </div>
      );
  }
}
