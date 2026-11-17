/**
 * ============================================================================
 *  CMS PAGE SCHEMAS
 * ============================================================================
 *  This file defines WHAT is editable per page — section names, field labels,
 *  and input types — for the admin CMS editor. It does NOT hold any content;
 *  actual values live in MongoDB (PageContent collection) and are seeded once
 *  via utils/seedCmsContent.js.
 *
 *  Field types:
 *   - text      single-line input
 *   - textarea  multi-line input
 *   - image     image upload (reuses the same upload endpoint as Services/Blog)
 *   - video     video embed URL (YouTube/Vimeo link)
 *   - list      a repeatable array of items, each with its own sub-fields
 *               (used for stats, achievements, testimonials, FAQ, etc.)
 *
 *  Adding a new editable field later is just adding an entry here — no DB
 *  migration needed, since PageContent.content is a flexible JSON blob.
 * ============================================================================
 */

const PAGE_SCHEMAS = {
  'what-we-treat': { label:'What Knead Me Treats', sections:[{key:'intro',label:'Introduction',fields:[{key:'heading',label:'Heading',type:'text'},{key:'description',label:'Description',type:'textarea'}]},{key:'conditions',label:'Conditions',type:'list',itemLabel:'Condition',itemFields:[{key:'title',label:'Title',type:'text'},{key:'text',label:'Description',type:'textarea'}]}]},
  'corporate-massage': {label:'Corporate Massage',sections:[{key:'intro',label:'Introduction',fields:[{key:'heading',label:'Heading',type:'text'},{key:'description',label:'Description',type:'textarea'}]}]},
  'terms-conditions': {label:'Terms and Conditions',sections:[{key:'legal',label:'Legal Content',fields:[{key:'body',label:'Content',type:'textarea'}]}]},
  'privacy-policy': {label:'Privacy Policy',sections:[{key:'legal',label:'Legal Content',fields:[{key:'body',label:'Content',type:'textarea'}]}]},
  'refund-policy': {label:'Refund Policy',sections:[{key:'legal',label:'Legal Content',fields:[{key:'body',label:'Content',type:'textarea'}]}]},

  'site-settings': {
    label: 'Site-Wide Settings',
    description: 'Contact details and links used across the whole site (navbar, footer, WhatsApp button, emails).',
    sections: [
      {
        key: 'contact',
        label: 'Contact Information',
        fields: [
          { key: 'phone', label: 'Phone Number (display)', type: 'text' },
          { key: 'whatsappNumber', label: 'WhatsApp Number (international format, no + or spaces, e.g. 447900313484)', type: 'text' },
          { key: 'email', label: 'Email Address', type: 'text' },
          { key: 'address', label: 'Address', type: 'textarea' },
        ],
      },
      {
        key: 'hours',
        label: 'Business Hours',
        fields: [
          { key: 'weekdays', label: 'Monday–Friday', type: 'text' },
          { key: 'saturday', label: 'Saturday', type: 'text' },
          { key: 'sunday', label: 'Sunday', type: 'text' },
        ],
      },
      {
        key: 'links',
        label: 'External Links',
        fields: [
          { key: 'googleReviewsUrl', label: 'Google Reviews URL', type: 'text' },
          { key: 'corporateUrl', label: 'Corporate Site URL', type: 'text' },
        ],
      },
    ],
  },

  home: {
    label: 'Homepage',
    sections: [
      {
        key: 'hero',
        label: 'Hero Section',
        fields: [
          { key: 'eyebrow', label: 'Eyebrow Text', type: 'text' },
          { key: 'headline', label: 'Headline', type: 'text' },
          { key: 'highlightWord', label: 'Highlighted Word (shown in accent colour)', type: 'text' },
          { key: 'subtext', label: 'Subheading', type: 'textarea' },
          { key: 'backgroundImage', label: 'Hero Background Image', type: 'image' },
          { key: 'video', label: 'Optional Hero/Intro Video URL', type: 'video' },
        ],
      },
      {
        key: 'stats',
        label: 'Stats Strip',
        type: 'list',
        itemLabel: 'Stat',
        itemFields: [
          { key: 'value', label: 'Value (e.g. 98%)', type: 'text' },
          { key: 'label', label: 'Label', type: 'text' },
        ],
      },
      {
        key: 'howItWorks',
        label: 'How Knead Me Works',
        type: 'list',
        itemLabel: 'Step',
        itemFields: [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'text', label: 'Description', type: 'textarea' },
        ],
      },
      {
        key: 'whyTrust',
        label: 'Why Clients Trust Knead Me',
        type: 'list',
        itemLabel: 'Point',
        itemFields: [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'text', label: 'Description', type: 'textarea' },
        ],
      },
      {
        key: 'achievements',
        label: 'Achievements & Certifications',
        type: 'list',
        itemLabel: 'Achievement',
        itemFields: [
          { key: 'icon', label: 'Icon (emoji)', type: 'text' },
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'sub', label: 'Subtitle', type: 'text' },
        ],
      },
      {
        key: 'benefitCategories',
        label: 'Benefits of Massage (Educational Section)',
        type: 'list',
        itemLabel: 'Category',
        itemFields: [
          { key: 'title', label: 'Category Title', type: 'text' },
          { key: 'items', label: 'Bullet Points (one per line)', type: 'textarea' },
        ],
      },
      {
        key: 'googleReviews',
        label: 'Google Reviews',
        type: 'list',
        itemLabel: 'Review',
        itemFields: [
          { key: 'name', label: 'Reviewer Name', type: 'text' },
          { key: 'text', label: 'Review Text', type: 'textarea' },
        ],
      },
      {
        key: 'cta',
        label: 'Bottom Call-to-Action',
        fields: [
          { key: 'headline', label: 'Headline', type: 'text' },
          { key: 'subtext', label: 'Subheading', type: 'textarea' },
        ],
      },
    ],
  },

  about: {
    label: 'About Page',
    sections: [
      {
        key: 'hero',
        label: 'Hero Section',
        fields: [
          { key: 'headline', label: 'Headline', type: 'text' },
          { key: 'subtext', label: 'Subheading', type: 'textarea' },
        ],
      },
      {
        key: 'story',
        label: 'Our Story',
        fields: [
          { key: 'body', label: 'Story Text', type: 'textarea' },
          { key: 'quote', label: 'Pull Quote', type: 'textarea' },
          { key: 'image', label: 'Story Image', type: 'image' },
        ],
      },
      {
        key: 'values',
        label: 'Mission & Philosophy',
        type: 'list',
        itemLabel: 'Value',
        itemFields: [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'text', label: 'Description', type: 'textarea' },
        ],
      },
      {
        key: 'therapistTeaser',
        label: 'Meet Your Therapist Teaser',
        fields: [
          { key: 'headline', label: 'Headline', type: 'text' },
          { key: 'body', label: 'Body Text', type: 'textarea' },
          { key: 'image', label: 'Portrait Image', type: 'image' },
        ],
      },
      {
        key: 'trustPoints',
        label: 'Why Clients Trust Us',
        type: 'list',
        itemLabel: 'Point',
        itemFields: [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'text', label: 'Description', type: 'textarea' },
        ],
      },
      {
        key: 'process',
        label: 'How It Works',
        type: 'list',
        itemLabel: 'Step',
        itemFields: [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'text', label: 'Description', type: 'textarea' },
        ],
      },
      {
        key: 'hygieneCommitment',
        label: 'Our Hygiene Commitment (one per line)',
        fields: [{ key: 'items', label: 'Items', type: 'textarea' }],
      },
      {
        key: 'safetyProtocols',
        label: 'Safety Protocols (one per line)',
        fields: [{ key: 'items', label: 'Items', type: 'textarea' }],
      },
      {
        key: 'testimonials',
        label: 'What Our Clients Say',
        type: 'list',
        itemLabel: 'Testimonial',
        itemFields: [
          { key: 'name', label: 'Name', type: 'text' },
          { key: 'text', label: 'Testimonial Text', type: 'textarea' },
        ],
      },
    ],
  },

  'massage-benefits': {
    label: 'Massage Benefits Page',
    sections: [
      {
        key: 'hero',
        label: 'Hero Section',
        fields: [
          { key: 'headline', label: 'Headline', type: 'text' },
          { key: 'subtext', label: 'Subheading', type: 'textarea' },
        ],
      },
      {
        key: 'whyMatters',
        label: 'Why Massage Therapy Matters',
        fields: [
          { key: 'body1', label: 'Paragraph 1', type: 'textarea' },
          { key: 'body2', label: 'Paragraph 2', type: 'textarea' },
          { key: 'image', label: 'Section Image', type: 'image' },
          { key: 'video', label: 'Optional Video URL', type: 'video' },
        ],
      },
      {
        key: 'keyBenefits',
        label: 'Key Benefits',
        type: 'list',
        itemLabel: 'Benefit',
        itemFields: [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'text', label: 'Description', type: 'textarea' },
        ],
      },
      {
        key: 'clinicalStandards',
        label: 'Our Clinical Standards',
        type: 'list',
        itemLabel: 'Standard',
        itemFields: [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'text', label: 'Description', type: 'textarea' },
        ],
      },
      {
        key: 'timeline',
        label: 'Long-Term Benefits Timeline',
        type: 'list',
        itemLabel: 'Stage',
        itemFields: [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'text', label: 'Description', type: 'textarea' },
        ],
      },
      {
        key: 'whoBenefits',
        label: 'Who Can Benefit',
        type: 'list',
        itemLabel: 'Group',
        itemFields: [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'text', label: 'Description', type: 'textarea' },
        ],
      },
      {
        key: 'testimonials',
        label: 'Client Testimonials',
        type: 'list',
        itemLabel: 'Testimonial',
        itemFields: [
          { key: 'name', label: 'Name', type: 'text' },
          { key: 'text', label: 'Testimonial Text', type: 'textarea' },
        ],
      },
      {
        key: 'faq',
        label: 'Frequently Asked Questions',
        type: 'list',
        itemLabel: 'Question',
        itemFields: [
          { key: 'q', label: 'Question', type: 'text' },
          { key: 'a', label: 'Answer', type: 'textarea' },
        ],
      },
    ],
  },

  'meet-your-therapist': {
    label: 'Meet Your Therapist Page',
    sections: [
      {
        key: 'bio',
        label: 'Biography',
        fields: [
          { key: 'headline', label: 'Headline', type: 'text' },
          { key: 'body', label: 'Bio Text', type: 'textarea' },
          { key: 'portrait', label: 'Portrait Image', type: 'image' },
        ],
      },
      {
        key: 'qualifications',
        label: 'Qualifications (one per line)',
        fields: [{ key: 'items', label: 'Items', type: 'textarea' }],
      },
      {
        key: 'specialisms',
        label: 'Areas of Focus',
        type: 'list',
        itemLabel: 'Specialism',
        itemFields: [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'text', label: 'Description', type: 'textarea' },
        ],
      },
      {
        key: 'philosophy',
        label: 'Treatment Philosophy',
        type: 'list',
        itemLabel: 'Principle',
        itemFields: [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'text', label: 'Description', type: 'textarea' },
        ],
      },
    ],
  },

  treatments: {
    label: 'Treatments / Price List Page',
    sections: [
      {
        key: 'hero',
        label: 'Hero Section',
        fields: [
          { key: 'headline', label: 'Headline', type: 'text' },
          { key: 'subtext', label: 'Subheading', type: 'textarea' },
        ],
      },
      {
        key: 'transparency',
        label: 'Why Our Pricing is Transparent',
        type: 'list',
        itemLabel: 'Point',
        itemFields: [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'text', label: 'Description', type: 'textarea' },
        ],
      },
      {
        key: 'faq',
        label: 'Frequently Asked Questions',
        type: 'list',
        itemLabel: 'Question',
        itemFields: [
          { key: 'q', label: 'Question', type: 'text' },
          { key: 'a', label: 'Answer', type: 'textarea' },
        ],
      },
    ],
  },

  'book-appointment': {
    label: 'Book Appointment Page',
    sections: [
      {
        key: 'hero',
        label: 'Hero Section',
        fields: [
          { key: 'headline', label: 'Headline', type: 'text' },
          { key: 'subtext', label: 'Subheading', type: 'textarea' },
        ],
      },
      {
        key: 'howItWorks',
        label: 'How Booking Works',
        type: 'list',
        itemLabel: 'Step',
        itemFields: [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'text', label: 'Description', type: 'textarea' },
        ],
      },
      {
        key: 'bookingInfo',
        label: 'Booking Information / Policies',
        type: 'list',
        itemLabel: 'Policy',
        itemFields: [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'text', label: 'Description', type: 'textarea' },
        ],
      },
      {
        key: 'testimonials',
        label: 'Testimonials',
        type: 'list',
        itemLabel: 'Testimonial',
        itemFields: [
          { key: 'name', label: 'Name', type: 'text' },
          { key: 'text', label: 'Testimonial Text', type: 'textarea' },
        ],
      },
    ],
  },

  'gift-a-treatment': {
    label: 'Gift a Treatment Page',
    sections: [
      {
        key: 'hero',
        label: 'Hero Section',
        fields: [
          { key: 'headline', label: 'Headline', type: 'text' },
          { key: 'subtext', label: 'Subheading', type: 'textarea' },
        ],
      },
    ],
  },
};

const getPageSchema = (pageKey) => PAGE_SCHEMAS[pageKey] || null;
const getAllPageKeys = () => Object.keys(PAGE_SCHEMAS);

module.exports = { PAGE_SCHEMAS, getPageSchema, getAllPageKeys };
