// In-memory fallback mock for Prisma when live PostgreSQL is unavailable
import { PrismaClient } from "@prisma/client";

let mockUsers: any[] = [
  {
    id: "user-1",
    name: "Mahalaxmi Admin",
    email: "admin@mahalaxmi.com",
    role: "admin",
    password: "$2a$10$YourHashedPasswordHere",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

let mockSettings: Record<string, string> = {
  site_name: "Mahalaxmi Enterprises",
  company_tagline: "Authorized Industrial Lube Distributor (ILD) - HPCL",
  proprietor_name: "Mahalaxmi Enterprises",
  contact_email: "info@hplubricantscfa.com",
  contact_phone: "+91 88007 78032",
  contact_address: "Baghpat Region & Surrounding Industrial Belts, Uttar Pradesh, India",
  primary_color: "#D8232A",
  secondary_color: "#0B0F29",
  gstin: "09AABCU9603R1ZM",
  established_year: "2023",
};

let mockNavigation: any[] = [
  { id: "nav-1", label: "Home", title: "HOME", url: "/", href: "/", order: 0, isStatic: true },
  {
    id: "nav-2",
    label: "About Us",
    title: "ABOUT US",
    url: "/about-us",
    href: "/about-us",
    order: 1,
    isStatic: true,
  },
  {
    id: "nav-3",
    label: "Products & Services",
    title: "PRODUCTS & SERVICES",
    url: "/products",
    href: "/products",
    order: 2,
    isStatic: true,
  },
  {
    id: "nav-4",
    label: "Events & Gallery",
    title: "EVENTS & GALLERY",
    url: "/events",
    href: "/events",
    order: 3,
    isStatic: true,
  },
  {
    id: "nav-5",
    label: "Blogs",
    title: "BLOGS",
    url: "/blogs",
    href: "/blogs",
    order: 4,
    isStatic: true,
  },
  {
    id: "nav-6",
    label: "Contact Us",
    title: "CONTACT US",
    url: "/contact-us",
    href: "/contact-us",
    order: 5,
    isStatic: true,
  },
];

let mockPages: any[] = [
  {
    id: "page-home",
    title: "Home",
    slug: "home",
    parent: "-",
    order: 0,
    type: "static",
    visibility: "published",
    isStatic: true,
    description:
      "Authorized Industrial Lube Distributor for Hindustan Petroleum Corporation Limited (HPCL).",
    metaTitle: "Mahalaxmi Enterprises | Authorized HP Lubricants Distributor",
    metaDescription:
      "Official Industrial Lube Distributor supplying high performance hydraulic oils, turbine oils, gear lubricants, and greases.",
    targetKeywords: "hpcl distributor, industrial lubricants baghpat, engine oils supplier",
    canonicalUrl: "https://mahalaxmilubricants.com",
    noIndex: false,
    featuredImage: "",
    ogTitle: "Mahalaxmi Enterprises",
    ogDescription: "Authorized HP Lubricants Distributor",
    ogImage: "",
    headingOptions: {},
    createdAt: new Date(),
    updatedAt: new Date(),
    sections: [
      {
        id: "sec-1",
        pageId: "page-home",
        type: "HeroSlider",
        order: 0,
        content: {
          slides: [
            {
              id: 1,
              img: "/Banner No 1.png",
              link: "#products",
              title: "HP Lubricants No. 1 Banner",
            },
            {
              id: 2,
              img: "/FuturX-1.jpg",
              link: "#products",
              title: "FUTUR-X ULTRA-SYNTHETIC PREMIUM ENGINE OILS",
            },
            {
              id: 3,
              img: "/FuturX-2.jpg",
              link: "#products",
              title: "FUTUR-X NEXT GEN ENGINE PROTECTION",
            },
            {
              id: 4,
              img: "/HP_Lube_Banner_new.png",
              link: "#products",
              title: "HP Lube New Banner",
            },
            {
              id: 5,
              img: "/HP-Racer-new-1929-x715 copy (1) (1).jpg",
              link: "#products",
              title: "HP Racer New Banner",
            },
            {
              id: 6,
              img: "/HPL-Sectorial-Web-Banner-1920x715-pix[9].jpg",
              link: "#products",
              title: "HIGH PERFORMANCE INDUSTRIAL & SECTORIAL LUBRICANTS",
            },
            {
              id: 7,
              img: "/Lubricants.jpg",
              link: "#products",
              title: "INDIA'S LEADING LUBE MARKETER",
            },
            {
              id: 8,
              img: "/New 1.jpg",
              link: "#products",
              title: "HP MILCY FLEET HEAVY DUTY DIESEL ENGINE OIL",
            },
            {
              id: 9,
              img: "/New 2.jpg",
              link: "#products",
              title: "HP NEOSYNTH ENGINE OIL",
            },
            {
              id: 10,
              img: "/Racer-Gen6.jpg",
              link: "#products",
              title: "HP RACER GEN6 2-WHEELER ENGINE OIL",
            },
          ],
        },
      },
      {
        id: "sec-2",
        pageId: "page-home",
        type: "AboutSection",
        order: 1,
        content: {
          title: "ABOUT HP LUBRICANTS & MAHALAXMI ENTERPRISES",
          subtitle:
            "Hindustan Petroleum Corporation Limited (HPCL) is a Fortune 500 company and one of India’s largest lubricant marketers.",
          bodyText:
            "Mahalaxmi Enterprises serves as an Authorized Industrial Lube Distributor (ILD), supplying genuine HPCL products directly to industrial plants, OEM contractors, transport fleets, and government departments.",
          buttonText: "READ MORE ABOUT US",
          buttonLink: "/about-us",
        },
      },
      {
        id: "sec-3",
        pageId: "page-home",
        type: "ProductsServicesSection",
        order: 2,
        content: {
          title: "OUR PRODUCTS & SERVICES",
          subtitle:
            "Comprehensive lubrication solutions engineered for peak mechanical efficiency.",
          categories: [
            { name: "Industrial Oils", slug: "industrial-oils", count: "15+ Subcategories" },
            { name: "Industrial Greases", slug: "industrial-greases", count: "High-Load Bearings" },
            { name: "Automotive Oils", slug: "automotive-oils", count: "Commercial Fleets" },
            { name: "Bike Engine Oils", slug: "bike-oils", count: "2-Wheelers & Bikes" },
          ],
        },
      },
    ],
  },
  {
    id: "page-about",
    title: "About Us",
    slug: "about-us",
    parent: "-",
    order: 1,
    type: "static",
    visibility: "published",
    isStatic: true,
    description:
      "Learn more about Mahalaxmi Enterprises and our authorized HPCL Lubricants partnership.",
    metaTitle: "About Us | Mahalaxmi Enterprises Authorized HP Lubricants",
    metaDescription:
      "Discover our journey as an Authorized Industrial Lube Distributor (ILD) delivering cutting-edge HPCL lubricants across India.",
    targetKeywords: "about mahalaxmi enterprises, hp lubricants distributor profile",
    canonicalUrl: "https://mahalaxmilubricants.com/about-us",
    noIndex: false,
    featuredImage: "",
    ogTitle: "About Us - Mahalaxmi Enterprises",
    ogDescription: "About HP Lubricants Division",
    ogImage: "",
    headingOptions: {},
    createdAt: new Date(),
    updatedAt: new Date(),
    sections: [
      {
        id: "sec-a1",
        pageId: "page-about",
        type: "AboutHero",
        order: 0,
        content: {
          bannerImage:
            "https://res.cloudinary.com/dpa93copz/image/upload/v1787736239/mahalaxmi/about/About-HPCL.jpg",
          altText: "About MAHALAXMI ENTERPRISES Banner",
          title: "About MAHALAXMI ENTERPRISES",
        },
      },
      {
        id: "sec-a2",
        pageId: "page-about",
        type: "AboutMahalaxmiContent",
        order: 1,
        content: {
          title: "ABOUT MAHALAXMI ENTERPRISES",
          subtitle: "Neha Goyal",
          proprietorRole: "Proprietor, Mahalaxmi Enterprises",
          distributorBadge: "Authorized Industrial Lube Distributor (ILD)",
          distributorCompany: "Hindustan Petroleum Corporation Limited (HPCL)",
          proprietorPhoto:
            "https://res.cloudinary.com/dpa93copz/image/upload/v1788858309/mahalaxmi/team/neha-goyal-proprietor.jpg",
          proprietorPhotoAlt: "Neha Goyal — Proprietor, Mahalaxmi Enterprises",
          paragraphs: [
            "Neha Goyal is the Proprietor of Mahalaxmi Enterprises, an authorized Industrial Lube Distributor (ILD) for HP Lubricants, serving the Baghpat region. With over a decade of experience in the lubricants industry, she has developed extensive expertise in providing reliable lubrication solutions across a wide range of industrial applications.",
            "Since establishing Mahalaxmi Enterprises in 2023, she has been committed to delivering high-quality HP Lubricants, backed by technical knowledge, prompt service, and a customer-centric approach. Under her leadership, the company has earned the trust of more than 100 industrial customers and has successfully supplied lubricants to various government departments.",
            "Her focus on long-term relationships, product reliability, and consistent service has positioned Mahalaxmi Enterprises as a dependable partner for industries seeking efficient and cost-effective lubrication solutions. With a vision to continuously expand the company's reach and service capabilities, Neha Goyal remains dedicated to helping customers enhance equipment performance, improve operational efficiency, and reduce maintenance costs through the right lubrication practices.",
          ],
          hpclOverview: {
            title: "About Hindustan Petroleum Corporation Limited (HPCL)",
            description:
              "HPCL is a Maharatna Central Public Sector Enterprise (CPSE) with a formidable market presence in refining and marketing petroleum products. HP Lubricants is India's largest lube marketer, offering 350+ grades of lubricants, specialties, and greases.",
            bullets: [
              "Over 350+ premium industrial & automotive lubricant grades",
              "State-of-the-art R&D facilities with international OEM approvals",
              "Extensive countrywide supply chain network & rapid delivery",
            ],
          },
          whyChooseTitle: "WHY CHOOSE MAHALAXMI ENTERPRISES",
          whyChooseSubtitle: "Delivering Quality. Building Trust.",
          whyChooseItems: [
            {
              title: "Industrial Lube Distributor",
              description: "Catering over 100 plus Industries.",
            },
            {
              title: "Wide Product Portfolio",
              description:
                "Complete lubrication and industrial maintenance solutions under one roof.",
            },
            {
              title: "Technical Expertise",
              description:
                "Professional guidance for selecting the right products for every application.",
            },
            {
              title: "Reliable Supply",
              description: "Consistent product availability with timely delivery.",
            },
            {
              title: "Quality Assurance",
              description: "Only genuine, high-performance industrial products.",
            },
            {
              title: "Customer-Centric Support",
              description: "Dedicated service to ensure long-term customer satisfaction.",
            },
          ],
        },
      },
      {
        id: "sec-a3",
        pageId: "page-about",
        type: "LubesHeadquarterSection",
        order: 2,
        content: {
          title: "MAHALAXMI ENTERPRISES",
          badge: "AUTHORIZED INDUSTRIAL LUBE DISTRIBUTOR (ILD)",
          proprietor: "Neha Goyal",
          servingRegion: "Baghpat Region & Surrounding Industrial Belts, Uttar Pradesh",
          establishment: "Est. 2023 | 100+ Industrial Clients & Government Department Supplier",
          phone: "+91 88007 78032",
          email: "info@hplubricantscfa.com",
        },
      },
    ],
  },
  {
    id: "page-contact",
    title: "Contact Us",
    slug: "contact-us",
    parent: "-",
    order: 2,
    type: "static",
    visibility: "published",
    isStatic: true,
    description:
      "Get in touch with Mahalaxmi Enterprises for bulk lubricants supply, enquiries, and dealership.",
    metaTitle: "Contact Us | Mahalaxmi Enterprises HPCL Distributor",
    metaDescription:
      "Reach out to our sales engineering team, head office, and regional branches across India.",
    targetKeywords: "contact mahalaxmi, hp lubricants dealer, lubricant quote",
    canonicalUrl: "https://mahalaxmilubricants.com/contact-us",
    noIndex: false,
    featuredImage: "/contact-us-banner.jpg",
    ogTitle: "Contact Us - Mahalaxmi Enterprises",
    ogDescription: "Contact HP Lubricants Distributor",
    ogImage: "/contact-us-banner.jpg",
    headingOptions: {},
    createdAt: new Date(),
    updatedAt: new Date(),
    sections: [
      {
        id: "sec-c1",
        pageId: "page-contact",
        type: "ContactHero",
        order: 0,
        content: {
          title: "Contact Us",
          subtitle: "",
          image: "/contact-us-banner.jpg",
          altText: "Contact Us - Mahalaxmi Enterprises",
        },
      },
      {
        id: "sec-c2",
        pageId: "page-contact",
        type: "ContactHeadquarter",
        order: 1,
        content: {
          companyName: "Mahalaxmi Enterprises",
          badge: "Authorized Industrial Lube Distributor",
          description:
            "Connect with our team for HP Lubricants requirements, technical seminars, and bulk inquiries.",
          proprietor: "Neha Goyal",
          address:
            "HPCL Petrol Pump, Ground & First Floor, Kh No- 487/0048, Aggarwal Mandi Tatiri, Tatiri, Agarwal Mandi, Baghpat, Uttar Pradesh - 250601",
          phone: "+91 88007 78032",
          whatsapp: "918800778032",
          email: "info@hplubricantscfa.com",
        },
      },
      {
        id: "sec-c3",
        pageId: "page-contact",
        type: "ContactForm",
        order: 2,
        content: {
          badge: "Online Request",
          title: "Send an Enquiry",
          subtitle:
            "Please fill in your details and our team will get back to you with pricing & availability.",
          buttonText: "Submit Enquiry",
        },
      },
    ],
  },
  {
    id: "page-events",
    title: "Events & Activities",
    slug: "events",
    parent: "-",
    order: 3,
    type: "static",
    visibility: "published",
    isStatic: true,
    description: "Events & Activities Gallery for Mahalaxmi Enterprises",
    metaTitle: "Events & Gallery | Mahalaxmi Enterprises",
    metaDescription:
      "Explore photo gallery and coverage of dealer meets, exhibitions, and industrial seminars.",
    targetKeywords: "events, gallery, hp lubricants exhibition, dealer meet",
    canonicalUrl: "https://mahalaxmilubricants.com/events",
    noIndex: false,
    featuredImage: "/events-banner.jpg",
    ogTitle: "Events & Activities - Mahalaxmi Enterprises",
    ogDescription: "Events and activities gallery",
    ogImage: "/events-banner.jpg",
    headingOptions: {},
    createdAt: new Date(),
    updatedAt: new Date(),
    sections: [
      {
        id: "sec-ev1",
        pageId: "page-events",
        type: "EventsHero",
        order: 0,
        content: {
          image: "/events-banner.jpg",
          altText: "MAHALAXMI ENTERPRISES Events & Activities Gallery Banner",
        },
      },
      {
        id: "sec-ev2",
        pageId: "page-events",
        type: "EventsContent",
        order: 1,
        content: {
          title: "EVENTS",
          introText:
            "Mahalaxmi Enterprises actively engages with their stakeholders by frequently hosting meetings and events with them. This includes meeting business partners, strategic partners, distributors, OEMs, agencies, mechanics, and industrial clients.",
        },
      },
      {
        id: "sec-ev3",
        pageId: "page-events",
        type: "EventsGallery",
        order: 2,
        content: {
          galleryItems: [
            {
              id: 1,
              title: "HP Racer & HP Neosynth CNBC TV18 Overdrive Awards",
              image:
                "https://www.hplubricants.in/sites/default/files/hplube-at-overdrive-awards.jpg",
              altText:
                "HP Racer and HP Neosynth partners with CNBC TV18 to sponsor Overdrive Awards",
            },
            {
              id: 2,
              title: "Neosynth Plus 0W 20 launch for Petrol Cars",
              image:
                "https://www.hplubricants.in/sites/default/files/neosynth-plus-0w-20-launch-for-petrol-cars.jpg",
              altText: "Neosynth Plus 0W 20 launch for Petrol Cars",
            },
            {
              id: 3,
              title: "Excon 2017 Discussion",
              image: "https://www.hplubricants.in/sites/default/files/b5.jpg",
              altText: "Excon 2017 Discussion",
            },
            {
              id: 4,
              title: "Excon 2017 Mahalaxmi Enterprises Stall Sideview",
              image: "https://www.hplubricants.in/sites/default/files/b4.jpg",
              altText: "Excon 2017 Mahalaxmi Enterprises Stall Sideview",
            },
            {
              id: 5,
              title: "Excon 2017 Mahalaxmi Enterprises Stall",
              image: "https://www.hplubricants.in/sites/default/files/b3.jpg",
              altText: "Excon 2017 Mahalaxmi Enterprises Stall",
            },
            {
              id: 6,
              title: "Excon 2017 HPCL Team",
              image: "https://www.hplubricants.in/sites/default/files/b2.jpg",
              altText: "Excon 2017 HPCL Team",
            },
            {
              id: 7,
              title: "Excon 2017 Ribbon Cutting",
              image: "https://www.hplubricants.in/sites/default/files/b1.jpg",
              altText: "Excon 2017 Ribbon Cutting",
            },
            {
              id: 8,
              title: "OEM meet at Chennai",
              image: "https://www.hplubricants.in/sites/default/files/18.jpg",
              altText: "OEM meet at Chennai",
            },
            {
              id: 9,
              title: "World Road Meeting Banner 2017",
              image: "https://www.hplubricants.in/sites/default/files/17.jpg",
              altText: "World Road Meeting Banner 2017",
            },
            {
              id: 10,
              title: "World Road Meeting Screen Display 2017",
              image: "https://www.hplubricants.in/sites/default/files/16.jpg",
              altText: "World Road Meeting Screen Display 2017",
            },
            {
              id: 11,
              title: "World Road Meeting Stall 2017",
              image: "https://www.hplubricants.in/sites/default/files/15.jpg",
              altText: "World Road Meeting Stall 2017",
            },
            {
              id: 12,
              title: "World Road Meeting Exhibition 2017",
              image: "https://www.hplubricants.in/sites/default/files/14.jpg",
              altText: "World Road Meeting Exhibition 2017",
            },
            {
              id: 13,
              title: "World Road Meeting Lube Counter 2017",
              image: "https://www.hplubricants.in/sites/default/files/13.jpg",
              altText: "World Road Meeting Lube Counter 2017",
            },
            {
              id: 14,
              title: "World Road Meeting I&C Counter 2017",
              image: "https://www.hplubricants.in/sites/default/files/12.jpg",
              altText: "World Road Meeting I&C Counter 2017",
            },
            {
              id: 15,
              title: "Road Safety 2017 Salute",
              image: "https://www.hplubricants.in/sites/default/files/11.jpg",
              altText: "Road Safety 2017 Salute",
            },
            {
              id: 16,
              title: "Road Safety 2017 Showcase",
              image: "https://www.hplubricants.in/sites/default/files/10.jpg",
              altText: "Road Safety 2017 Showcase",
            },
            {
              id: 17,
              title: "Milcy Super Launch",
              image: "https://www.hplubricants.in/sites/default/files/9.jpg",
              altText: "Milcy Super Launch",
            },
            {
              id: 18,
              title: "Mahalaxmi Enterprises ConMac 2017 Showcase",
              image: "https://www.hplubricants.in/sites/default/files/8.jpg",
              altText: "Mahalaxmi Enterprises ConMac 2017 Showcase",
            },
            {
              id: 19,
              title: "Mahalaxmi Enterprises ConMac 2017",
              image: "https://www.hplubricants.in/sites/default/files/7.jpg",
              altText: "Mahalaxmi Enterprises ConMac 2017",
            },
            {
              id: 20,
              title: "Inauguration of POL Testing laboratory for Indian Army",
              image: "https://www.hplubricants.in/sites/default/files/6.jpg",
              altText: "Inauguration of POL Testing laboratory for Indian Army",
            },
            {
              id: 21,
              title: "Inauguration of POL Testing laboratory for Indian Army Showcase",
              image: "https://www.hplubricants.in/sites/default/files/5.jpg",
              altText: "Inauguration of POL Testing laboratory for Indian Army Showcase",
            },
            {
              id: 22,
              title: "Inauguration of POL Testing laboratory for Indian Army Ribbon Cut",
              image: "https://www.hplubricants.in/sites/default/files/4.jpg",
              altText: "Inauguration of POL Testing laboratory for Indian Army Ribbon Cut",
            },
            {
              id: 23,
              title: "Inauguration of POL Testing laboratory for Indian Army Walk",
              image: "https://www.hplubricants.in/sites/default/files/3.jpg",
              altText: "Inauguration of POL Testing laboratory for Indian Army Walk",
            },
            {
              id: 24,
              title: "Inauguration of POL Testing laboratory for Indian Army Chat",
              image: "https://www.hplubricants.in/sites/default/files/2.jpg",
              altText: "Inauguration of POL Testing laboratory for Indian Army Chat",
            },
            {
              id: 25,
              title: "Inauguration of POL Testing laboratory for Indian Army Red Carpet",
              image: "https://www.hplubricants.in/sites/default/files/1.jpg",
              altText: "Inauguration of POL Testing laboratory for Indian Army Red Carpet",
            },
          ],
        },
      },
    ],
  },
  {
    id: "page-blogs",
    title: "Technical Articles & Lubrication Insights",
    slug: "blogs",
    parent: "-",
    order: 4,
    type: "static",
    visibility: "published",
    isStatic: true,
    description:
      "Technical articles, educational guides, and lubrication maintenance recommendations.",
    metaTitle: "Blogs & Insights | Mahalaxmi Enterprises",
    metaDescription:
      "Learn how often to change engine oils, hydraulic fluid maintenance, and lubrication best practices.",
    targetKeywords: "blogs, engine oil change guide, lubrication maintenance",
    canonicalUrl: "https://mahalaxmilubricants.com/blogs",
    noIndex: false,
    featuredImage: "/blogs-banner.jpg",
    ogTitle: "Technical Articles & Lubrication Insights",
    ogDescription: "Lubrication best practices and technical articles",
    ogImage: "/blogs-banner.jpg",
    headingOptions: {},
    createdAt: new Date(),
    updatedAt: new Date(),
    sections: [
      {
        id: "sec-bl1",
        pageId: "page-blogs",
        type: "BlogsHero",
        order: 0,
        content: {
          image: "/blogs-banner.jpg",
          altText: "Blogs - Mahalaxmi Enterprises HP Lubricants",
        },
      },
      {
        id: "sec-bl2",
        pageId: "page-blogs",
        type: "BlogCategories",
        order: 1,
        content: [
          {
            id: "cat-auto",
            name: "Automotive",
            slug: "automotive",
            description:
              "Engine oils, gear lubricants, coolants for commercial and passenger vehicles.",
          },
          {
            id: "cat-ind",
            name: "Industrial",
            slug: "industrial",
            description: "Hydraulic oils, turbine oils, and heavy machinery lubrication guides.",
          },
          {
            id: "cat-bike",
            name: "Bike Oils",
            slug: "bike-oils",
            description: "2-wheeler and 4-stroke motorcycle engine maintenance insights.",
          },
          {
            id: "cat-spec",
            name: "Specialties",
            slug: "specialties",
            description: "Transformer oils, cutting fluids, and specialty industrial applications.",
          },
        ],
      },
    ],
  },
];

let mockCategories: any[] = [
  {
    id: "cat-1",
    name: "Industrial Oils",
    slug: "industrial-oils",
    shortDesc:
      "High performance hydraulic, compressor, turbine, transformer, gear, film, and machinery lubricants.",
    fullDesc:
      "Discover MAHALAXMI ENTERPRISES' industrial oils tailored for hydraulic systems, gearboxes, compressors, sugar mills, and more. Trusted for quality, innovation, and reliability.",
    coverImage:
      "https://www.hplubricants.in/sites/default/files/styles/product_category_thumb/public/Compressor-Oils.png",
    order: 0,
    isFeatured: true,
    createdAt: "2026-08-26T06:15:04.336Z",
    updatedAt: "2026-08-26T06:15:04.336Z",
  },
  {
    id: "cat-2",
    name: "Industrial Greases",
    slug: "industrial-greases",
    shortDesc:
      "Extreme pressure lithium, complex, wheel bearing, and specialty temperature resistant greases.",
    fullDesc:
      "MAHALAXMI ENTERPRISES supplies premium industrial greases formulated for heavy machinery bearings, steel mills, and high temperature applications.",
    coverImage:
      "https://www.hplubricants.in/sites/default/files/styles/product_category_thumb/public/Industrial-Greases.png",
    order: 1,
    isFeatured: true,
    createdAt: "2026-08-26T06:15:04.336Z",
    updatedAt: "2026-08-26T06:15:04.336Z",
  },
  {
    id: "cat-3",
    name: "Automotive Oils",
    slug: "automotive-oils",
    shortDesc: "High-quality automotive, agricultural, passenger car, and engine oils.",
    fullDesc:
      "Explore MAHALAXMI ENTERPRISES' range of automotive, agricultural, and commercial engine oils offering superior quality and performance for all your vehicles.",
    coverImage:
      "https://www.hplubricants.in/sites/default/files/styles/product_category_thumb/public/Automotive-Oils.png",
    order: 2,
    isFeatured: true,
    createdAt: "2026-08-26T06:15:04.336Z",
    updatedAt: "2026-08-26T06:15:04.336Z",
  },
  {
    id: "cat-4",
    name: "Bike Engine Oils",
    slug: "bike-oils",
    shortDesc: "4-stroke motorcycle engine lubricants with JASO MA2 wet clutch specification.",
    fullDesc:
      "HP RACER 4T motorcycle oils provide 3-in-1 protection for motorcycle engine, wet clutch, and transmission gearbox.",
    coverImage:
      "https://www.hplubricants.in/sites/default/files/styles/product_category_thumb/public/Automotive-Oils.png",
    order: 3,
    isFeatured: true,
    createdAt: "2026-08-26T06:15:04.336Z",
    updatedAt: "2026-08-26T06:15:04.336Z",
  },
];

let mockProducts: any[] = [
  {
    id: "prod-1",
    name: "HYCOM 150 P",
    slug: "hycom-150-p",
    subtitle: "COMPRESSOR OILS",
    categorySlug: "industrial-oils",
    categoryName: "Industrial Oils",
    subCategoryTitle: "COMPRESSOR OILS",
    containerImage: "https://www.hplubricants.in/sites/default/files/15-W-40-Final-Graphic.jpg",
    description: "Specially developed for railway compressors.",
    applicationAreas: "Specially developed for railway compressors.",
    performanceBenefits: [
      "This oil has good demulsibility property, low deposits and sludge foaming tendency at a wide range of working temperature and in any gaseous atmosphere.",
      "Meets DIN 51506 VDL specifications, IS 13256:1992 DAB",
    ],
    specialFeatures: [
      "It is blended out of highly refined turbine base stocks and special types of anti-oxidants, anti-rust, anti-foam and demulsifier which do not react to any of the types of gases.",
    ],
    specsText: "Meets DIN 51506 VDL specifications, IS 13256:1992 DAB",
    tableHeaders: ["Property", "Value"],
    propertiesTable: [
      {
        property: "Appearance",
        value: "Clear",
      },
      {
        property: "Acidity, Total mg KOH / g",
        value: "0.20",
      },
      {
        property: "Density @ 29.5°C, g/cc",
        value: "0.8770",
      },
      {
        property: "Flash Point, COC, °C",
        value: ">210",
      },
      {
        property: "Pour Point, °C",
        value: "<-15",
      },
      {
        property: "OXIDATION STABILITY @ 135°C, 168 Hrs",
        value: "Pass",
      },
      {
        property: "FZG Rig Test, Pass Load Stage",
        value: ">8",
      },
      {
        property: "Rusting Test, Syn Sea Water, 24 Hrs",
        value: "Pass",
      },
      {
        property: "Kin. Viscosity @ 40°C, cSt",
        value: "135-165",
      },
      {
        property: "Kin. Viscosity @ 100°C, cSt",
        value: "15.0",
      },
      {
        property: "Viscosity Index",
        value: "100",
      },
    ],
    pdfUrl: "/docs/HYCOM_150_P_TDS.pdf",
    msdsUrl: "/docs/HYCOM_150_P_MSDS.pdf",
    isFeatured: true,
    order: 0,
    createdAt: "2026-08-26T06:15:04.336Z",
    updatedAt: "2026-08-26T06:15:04.336Z",
  },
  {
    id: "prod-2",
    name: "HYCOM C 100, 150, 220, 320, 460",
    slug: "hycom-c-series",
    subtitle: "COMPRESSOR OILS",
    categorySlug: "industrial-oils",
    categoryName: "Industrial Oils",
    subCategoryTitle: "COMPRESSOR OILS",
    containerImage: "https://www.hplubricants.in/sites/default/files/15-W-40-Final-Graphic.jpg",
    description: "Reciprocating air compressor lubrication.",
    applicationAreas: "Reciprocating air compressor lubrication.",
    performanceBenefits: ["High thermal stability", "Low carbon residue"],
    specialFeatures: [],
    specsText: "",
    tableHeaders: ["Property", "Value"],
    propertiesTable: [
      {
        property: "ISO VG",
        value: "100 - 460",
      },
    ],
    pdfUrl: "/docs/TDS.pdf",
    msdsUrl: "/docs/MSDS.pdf",
    isFeatured: true,
    order: 1,
    createdAt: "2026-08-26T06:15:04.336Z",
    updatedAt: "2026-08-26T06:15:04.336Z",
  },
  {
    id: "prod-3",
    name: "HYCOM LS EXPO SERIES",
    slug: "hycom-ls-expo",
    subtitle: "COMPRESSOR OILS",
    categorySlug: "industrial-oils",
    categoryName: "Industrial Oils",
    subCategoryTitle: "COMPRESSOR OILS",
    containerImage: "https://www.hplubricants.in/sites/default/files/15-W-40-Final-Graphic.jpg",
    description: "Long service life screw compressor oil.",
    applicationAreas: "Long service life screw compressor oil.",
    performanceBenefits: ["Anti-wear", "Oxidation resistance"],
    specialFeatures: [],
    specsText: "",
    tableHeaders: ["Property", "Value"],
    propertiesTable: [
      {
        property: "Type",
        value: "Synthetic Blend",
      },
    ],
    pdfUrl: "/docs/TDS.pdf",
    msdsUrl: "/docs/MSDS.pdf",
    isFeatured: true,
    order: 2,
    createdAt: "2026-08-26T06:15:04.336Z",
    updatedAt: "2026-08-26T06:15:04.336Z",
  },
  {
    id: "prod-4",
    name: "HYCOM LS SERIES",
    slug: "hycom-ls-series",
    subtitle: "COMPRESSOR OILS",
    categorySlug: "industrial-oils",
    categoryName: "Industrial Oils",
    subCategoryTitle: "COMPRESSOR OILS",
    containerImage: "https://www.hplubricants.in/sites/default/files/15-W-40-Final-Graphic.jpg",
    description: "Rotary screw air compressors.",
    applicationAreas: "Rotary screw air compressors.",
    performanceBenefits: ["Extended drain interval"],
    specialFeatures: [],
    specsText: "",
    tableHeaders: ["Property", "Value"],
    propertiesTable: [
      {
        property: "Type",
        value: "Rotary Screw Oil",
      },
    ],
    pdfUrl: "/docs/TDS.pdf",
    msdsUrl: "/docs/MSDS.pdf",
    isFeatured: true,
    order: 3,
    createdAt: "2026-08-26T06:15:04.336Z",
    updatedAt: "2026-08-26T06:15:04.336Z",
  },
  {
    id: "prod-5",
    name: "HYCOM PGE",
    slug: "hycom-pge",
    subtitle: "COMPRESSOR OILS",
    categorySlug: "industrial-oils",
    categoryName: "Industrial Oils",
    subCategoryTitle: "COMPRESSOR OILS",
    containerImage: "https://www.hplubricants.in/sites/default/files/15-W-40-Final-Graphic.jpg",
    description: "Polyglycol synthetic compressor lubricant.",
    applicationAreas: "Polyglycol synthetic compressor lubricant.",
    performanceBenefits: ["Gas compressor compatibility"],
    specialFeatures: [],
    specsText: "",
    tableHeaders: ["Property", "Value"],
    propertiesTable: [
      {
        property: "Base",
        value: "PAG Synthetic",
      },
    ],
    pdfUrl: "/docs/TDS.pdf",
    msdsUrl: "/docs/MSDS.pdf",
    isFeatured: true,
    order: 4,
    createdAt: "2026-08-26T06:15:04.336Z",
    updatedAt: "2026-08-26T06:15:04.336Z",
  },
  {
    id: "prod-6",
    name: "CYNDOL GRADES",
    slug: "cyndol-grades",
    subtitle: "CYLINDER OIL",
    categorySlug: "industrial-oils",
    categoryName: "Industrial Oils",
    subCategoryTitle: "CYLINDER OIL",
    containerImage: "https://www.hplubricants.in/sites/default/files/15-W-40-Final-Graphic.jpg",
    description:
      "Steam engine cylinders and worm gear drives operating under heavy wet steam conditions.",
    applicationAreas:
      "Steam engine cylinders and worm gear drives operating under heavy wet steam conditions.",
    performanceBenefits: ["Compounded with fatty oils", "Resists water washing"],
    specialFeatures: [],
    specsText: "",
    tableHeaders: ["Property", "Value"],
    propertiesTable: [
      {
        property: "Viscosity @ 100°C",
        value: "30 - 45 cSt",
      },
    ],
    pdfUrl: "/docs/TDS.pdf",
    msdsUrl: "/docs/MSDS.pdf",
    isFeatured: true,
    order: 5,
    createdAt: "2026-08-26T06:15:04.336Z",
    updatedAt: "2026-08-26T06:15:04.336Z",
  },
  {
    id: "prod-7",
    name: "HP FILM OIL",
    slug: "hp-film-oil",
    subtitle: "FILM OILS & STEEL MILL BEARING OILS",
    categorySlug: "industrial-oils",
    categoryName: "Industrial Oils",
    subCategoryTitle: "FILM OIL",
    containerImage: "https://www.hplubricants.in/sites/default/files/15-W-40-Final-Graphic.jpg",
    description:
      "HP FILM OIL grades are recommended for use in anti-friction bearings, plain bearings, drive gears and pinion of steel mills, where operating conditions are moderate. They are also suitable for use in circulation systems, where oils with high demulsibility characteristics are required.",
    applicationAreas:
      "HP FILM OIL grades are recommended for use in anti-friction bearings, plain bearings, drive gears and pinion of steel mills, where operating conditions are moderate. They are also suitable for use in circulation systems, where oils with high demulsibility characteristics are required.",
    performanceBenefits: [
      "Excellent oxidation stability",
      "High demulsibility",
      "Non-corrosive to materials",
    ],
    specialFeatures: [
      "HP FILM OILS are highly refined mineral oils suitable for oil film bearings used in steel plants. The product is blended from solvent extracted high viscosity index base stocks having excellent demulsibility characteristics. They also possess good oxidation and thermal stability.",
    ],
    specsText: "HP FILM OIL grades meet IPSS 1-09-001-95 GRADE 1 TO 6 & IS : 6552-1987",
    tableHeaders: ["46", "68", "100", "150", "220"],
    propertiesTable: [
      {
        property: "Appearance",
        value: "Bright & Clear",
      },
      {
        property: "Kinematic, Viscosity, cSt, @ 40°C",
        value: "",
        values: ["46", "68", "100", "150", "220"],
      },
      {
        property: "Kinematic, Viscosity, cSt, @ 100°C",
        value: "",
        values: ["4.0", "5.0", "6.1", "7.8", "10.1"],
      },
      {
        property: "Viscosity Index, Min",
        value: "",
        values: ["90", "90", "90", "90", "90"],
      },
      {
        property: "Flash Point, COC,°C, Min.",
        value: "",
        values: ["160", "190", "200", "210", "230"],
      },
      {
        property: "Pour Point, °C, Max.",
        value: "",
        values: ["(-)18", "(-)18", "(-)15", "(-)12", "(-)12"],
      },
      {
        property: "Copper Strip Corrosion, @ 100°C For 3 Hrs.",
        value: "Pass",
      },
      {
        property: "Emulsion Characteristics, In 20 Minutes,ml, At 54°C At 82°C",
        value: "",
        values: ["40-37-3", "40-37-3", "-", "-", "-"],
      },
    ],
    pdfUrl: "/docs/HP_FILM_OIL_TDS.pdf",
    msdsUrl: "/docs/HP_FILM_OIL_MSDS.pdf",
    isFeatured: true,
    order: 6,
    createdAt: "2026-08-26T06:15:04.336Z",
    updatedAt: "2026-08-26T06:15:04.336Z",
  },
  {
    id: "prod-8",
    name: "HP STEEL 320",
    slug: "hp-steel-320",
    subtitle: "FILM OIL",
    categorySlug: "industrial-oils",
    categoryName: "Industrial Oils",
    subCategoryTitle: "FILM OIL",
    containerImage: "https://www.hplubricants.in/sites/default/files/15-W-40-Final-Graphic.jpg",
    description: "Heavy duty steel mill roll neck bearings.",
    applicationAreas: "Heavy duty steel mill roll neck bearings.",
    performanceBenefits: ["Water separation"],
    specialFeatures: [],
    specsText: "",
    tableHeaders: ["Property", "Value"],
    propertiesTable: [
      {
        property: "ISO VG",
        value: "320",
      },
    ],
    pdfUrl: "/docs/TDS.pdf",
    msdsUrl: "/docs/MSDS.pdf",
    isFeatured: true,
    order: 7,
    createdAt: "2026-08-26T06:15:04.336Z",
    updatedAt: "2026-08-26T06:15:04.336Z",
  },
  {
    id: "prod-9",
    name: "HP STEEL EP 100",
    slug: "hp-steel-ep-100",
    subtitle: "FILM OIL",
    categorySlug: "industrial-oils",
    categoryName: "Industrial Oils",
    subCategoryTitle: "FILM OIL",
    containerImage: "https://www.hplubricants.in/sites/default/files/15-W-40-Final-Graphic.jpg",
    description: "Steel wire rod mill high speed bearings.",
    applicationAreas: "Steel wire rod mill high speed bearings.",
    performanceBenefits: ["Extreme pressure EP protection"],
    specialFeatures: [],
    specsText: "",
    tableHeaders: ["Property", "Value"],
    propertiesTable: [
      {
        property: "ISO VG",
        value: "100",
      },
    ],
    pdfUrl: "/docs/TDS.pdf",
    msdsUrl: "/docs/MSDS.pdf",
    isFeatured: false,
    order: 8,
    createdAt: "2026-08-26T06:15:04.336Z",
    updatedAt: "2026-08-26T06:15:04.336Z",
  },
  {
    id: "prod-10",
    name: "HP STEEL GRADES",
    slug: "hp-steel-grades",
    subtitle: "FILM OIL",
    categorySlug: "industrial-oils",
    categoryName: "Industrial Oils",
    subCategoryTitle: "FILM OIL",
    containerImage: "https://www.hplubricants.in/sites/default/files/15-W-40-Final-Graphic.jpg",
    description: "Rolling mill Morgoil lubrication systems.",
    applicationAreas: "Rolling mill Morgoil lubrication systems.",
    performanceBenefits: ["Oxidation resistance"],
    specialFeatures: [],
    specsText: "",
    tableHeaders: ["Property", "Value"],
    propertiesTable: [
      {
        property: "Series",
        value: "Steel Grades",
      },
    ],
    pdfUrl: "/docs/TDS.pdf",
    msdsUrl: "/docs/MSDS.pdf",
    isFeatured: false,
    order: 9,
    createdAt: "2026-08-26T06:15:04.336Z",
    updatedAt: "2026-08-26T06:15:04.336Z",
  },
  {
    id: "prod-11",
    name: "HP FLUSHING OIL",
    slug: "hp-flushing-oil",
    subtitle: "MACHINERY OILS",
    categorySlug: "industrial-oils",
    categoryName: "Industrial Oils",
    subCategoryTitle: "GENERAL PURPOSE MACHINERY OILS",
    containerImage: "https://www.hplubricants.in/sites/default/files/15-W-40-Final-Graphic.jpg",
    description: "Flushing out old oil, sludge, and contaminants.",
    applicationAreas: "Flushing out old oil, sludge, and contaminants.",
    performanceBenefits: ["High solvency", "Viscosity light"],
    specialFeatures: [],
    specsText: "",
    tableHeaders: ["Property", "Value"],
    propertiesTable: [
      {
        property: "Viscosity @ 40°C",
        value: "15 - 22 cSt",
      },
    ],
    pdfUrl: "/docs/TDS.pdf",
    msdsUrl: "/docs/MSDS.pdf",
    isFeatured: false,
    order: 10,
    createdAt: "2026-08-26T06:15:04.336Z",
    updatedAt: "2026-08-26T06:15:04.336Z",
  },
  {
    id: "prod-12",
    name: "YANTROL / YANTROL N SERIES",
    slug: "yantrol-series",
    subtitle: "MACHINERY OILS",
    categorySlug: "industrial-oils",
    categoryName: "Industrial Oils",
    subCategoryTitle: "GENERAL PURPOSE MACHINERY OILS",
    containerImage: "https://www.hplubricants.in/sites/default/files/15-W-40-Final-Graphic.jpg",
    description: "Textile looms and plain bearings.",
    applicationAreas: "Textile looms and plain bearings.",
    performanceBenefits: ["Non-drip tacky property"],
    specialFeatures: [],
    specsText: "",
    tableHeaders: ["Property", "Value"],
    propertiesTable: [
      {
        property: "Viscosity Grades",
        value: "32 to 460",
      },
    ],
    pdfUrl: "/docs/TDS.pdf",
    msdsUrl: "/docs/MSDS.pdf",
    isFeatured: false,
    order: 11,
    createdAt: "2026-08-26T06:15:04.336Z",
    updatedAt: "2026-08-26T06:15:04.336Z",
  },
  {
    id: "prod-13",
    name: "ENKLO 32 SUPER",
    slug: "enklo-32-super",
    subtitle: "HYDRAULIC OILS",
    categorySlug: "industrial-oils",
    categoryName: "Industrial Oils",
    subCategoryTitle: "HYDRAULIC OILS",
    containerImage: "https://www.hplubricants.in/sites/default/files/15-W-40-Final-Graphic.jpg",
    description: "Precision CNC machine tools.",
    applicationAreas: "Precision CNC machine tools.",
    performanceBenefits: ["Anti-wear protection"],
    specialFeatures: [],
    specsText: "",
    tableHeaders: ["Property", "Value"],
    propertiesTable: [
      {
        property: "ISO VG",
        value: "32",
      },
    ],
    pdfUrl: "/docs/TDS.pdf",
    msdsUrl: "/docs/MSDS.pdf",
    isFeatured: false,
    order: 12,
    createdAt: "2026-08-26T06:15:04.336Z",
    updatedAt: "2026-08-26T06:15:04.336Z",
  },
  {
    id: "prod-14",
    name: "ENKLO 46 PREMIUM",
    slug: "enklo-46-premium",
    subtitle: "HYDRAULIC OILS",
    categorySlug: "industrial-oils",
    categoryName: "Industrial Oils",
    subCategoryTitle: "HYDRAULIC OILS",
    containerImage: "https://www.hplubricants.in/sites/default/files/15-W-40-Final-Graphic.jpg",
    description: "Industrial hydraulic presses.",
    applicationAreas: "Industrial hydraulic presses.",
    performanceBenefits: ["Demulsibility"],
    specialFeatures: [],
    specsText: "",
    tableHeaders: ["Property", "Value"],
    propertiesTable: [
      {
        property: "ISO VG",
        value: "46",
      },
    ],
    pdfUrl: "/docs/TDS.pdf",
    msdsUrl: "/docs/MSDS.pdf",
    isFeatured: false,
    order: 13,
    createdAt: "2026-08-26T06:15:04.336Z",
    updatedAt: "2026-08-26T06:15:04.336Z",
  },
  {
    id: "prod-15",
    name: "ENKLO 46 SUPER",
    slug: "enklo-46-super",
    subtitle: "HYDRAULIC OILS",
    categorySlug: "industrial-oils",
    categoryName: "Industrial Oils",
    subCategoryTitle: "HYDRAULIC OILS",
    containerImage: "https://www.hplubricants.in/sites/default/files/15-W-40-Final-Graphic.jpg",
    description: "Mobile earthmoving machinery.",
    applicationAreas: "Mobile earthmoving machinery.",
    performanceBenefits: ["Anti-foam"],
    specialFeatures: [],
    specsText: "",
    tableHeaders: ["Property", "Value"],
    propertiesTable: [
      {
        property: "ISO VG",
        value: "46",
      },
    ],
    pdfUrl: "/docs/TDS.pdf",
    msdsUrl: "/docs/MSDS.pdf",
    isFeatured: false,
    order: 14,
    createdAt: "2026-08-26T06:15:04.336Z",
    updatedAt: "2026-08-26T06:15:04.336Z",
  },
  {
    id: "prod-16",
    name: "ENKLO 68 PREMIUM",
    slug: "enklo-68-premium",
    subtitle: "HYDRAULIC OILS",
    categorySlug: "industrial-oils",
    categoryName: "Industrial Oils",
    subCategoryTitle: "HYDRAULIC OILS",
    containerImage: "https://www.hplubricants.in/sites/default/files/15-W-40-Final-Graphic.jpg",
    description: "Heavy duty hydraulic systems.",
    applicationAreas: "Heavy duty hydraulic systems.",
    performanceBenefits: ["Shear stability"],
    specialFeatures: [],
    specsText: "",
    tableHeaders: ["Property", "Value"],
    propertiesTable: [
      {
        property: "ISO VG",
        value: "68",
      },
    ],
    pdfUrl: "/docs/TDS.pdf",
    msdsUrl: "/docs/MSDS.pdf",
    isFeatured: false,
    order: 15,
    createdAt: "2026-08-26T06:15:04.336Z",
    updatedAt: "2026-08-26T06:15:04.336Z",
  },
  {
    id: "prod-17",
    name: "ENKLO 68 SUPER",
    slug: "enklo-68-super",
    subtitle: "HYDRAULIC OILS",
    categorySlug: "industrial-oils",
    categoryName: "Industrial Oils",
    subCategoryTitle: "HYDRAULIC OILS",
    containerImage: "https://www.hplubricants.in/sites/default/files/15-W-40-Final-Graphic.jpg",
    description: "High-pressure hydraulic pumps.",
    applicationAreas: "High-pressure hydraulic pumps.",
    performanceBenefits: ["Pump anti-wear"],
    specialFeatures: [],
    specsText: "",
    tableHeaders: ["Property", "Value"],
    propertiesTable: [
      {
        property: "Kin. Viscosity @ 40°C",
        value: "64.0 - 72.0 cSt",
      },
    ],
    pdfUrl: "/docs/ENKLO_68_TDS.pdf",
    msdsUrl: "/docs/ENKLO_68_MSDS.pdf",
    isFeatured: false,
    order: 16,
    createdAt: "2026-08-26T06:15:04.336Z",
    updatedAt: "2026-08-26T06:15:04.336Z",
  },
  {
    id: "prod-18",
    name: "WAYLUBE",
    slug: "waylube-grades",
    subtitle: "MACHINERY OILS",
    categorySlug: "industrial-oils",
    categoryName: "Industrial Oils",
    subCategoryTitle: "MACHINERY OILS",
    containerImage: "https://www.hplubricants.in/sites/default/files/15-W-40-Final-Graphic.jpg",
    description: "Machine tool slideways and guides.",
    applicationAreas: "Machine tool slideways and guides.",
    performanceBenefits: ["Prevents stick-slip chatter"],
    specialFeatures: [],
    specsText: "",
    tableHeaders: ["Property", "Value"],
    propertiesTable: [
      {
        property: "ISO VG",
        value: "68 / 220",
      },
    ],
    pdfUrl: "/docs/TDS.pdf",
    msdsUrl: "/docs/MSDS.pdf",
    isFeatured: false,
    order: 17,
    createdAt: "2026-08-26T06:15:04.336Z",
    updatedAt: "2026-08-26T06:15:04.336Z",
  },
  {
    id: "prod-19",
    name: "HYTAK",
    slug: "hytak-base",
    subtitle: "OPEN GEAR COMPOUNDS",
    categorySlug: "industrial-oils",
    categoryName: "Industrial Oils",
    subCategoryTitle: "OPEN GEAR COMPOUNDS",
    containerImage: "https://www.hplubricants.in/sites/default/files/15-W-40-Final-Graphic.jpg",
    description: "Heavy open gears.",
    applicationAreas: "Heavy open gears.",
    performanceBenefits: ["Bitumen free compound"],
    specialFeatures: [],
    specsText: "",
    tableHeaders: ["Property", "Value"],
    propertiesTable: [
      {
        property: "Type",
        value: "Open Gear Compound",
      },
    ],
    pdfUrl: "/docs/TDS.pdf",
    msdsUrl: "/docs/MSDS.pdf",
    isFeatured: false,
    order: 18,
    createdAt: "2026-08-26T06:15:04.336Z",
    updatedAt: "2026-08-26T06:15:04.336Z",
  },
  {
    id: "prod-20",
    name: "HYTAK 500 NB",
    slug: "hytak-500-nb",
    subtitle: "OPEN GEAR COMPOUNDS",
    categorySlug: "industrial-oils",
    categoryName: "Industrial Oils",
    subCategoryTitle: "OPEN GEAR COMPOUNDS",
    containerImage: "https://www.hplubricants.in/sites/default/files/15-W-40-Final-Graphic.jpg",
    description: "Cement kilns open gear lubricant.",
    applicationAreas: "Cement kilns open gear lubricant.",
    performanceBenefits: ["Non-toxic"],
    specialFeatures: [],
    specsText: "",
    tableHeaders: ["Property", "Value"],
    propertiesTable: [
      {
        property: "Grade",
        value: "500 NB",
      },
    ],
    pdfUrl: "/docs/TDS.pdf",
    msdsUrl: "/docs/MSDS.pdf",
    isFeatured: false,
    order: 19,
    createdAt: "2026-08-26T06:15:04.336Z",
    updatedAt: "2026-08-26T06:15:04.336Z",
  },
  {
    id: "prod-21",
    name: "HYTAK 500 NB-1000",
    slug: "hytak-500-nb-1000",
    subtitle: "OPEN GEAR COMPOUNDS",
    categorySlug: "industrial-oils",
    categoryName: "Industrial Oils",
    subCategoryTitle: "OPEN GEAR COMPOUNDS",
    containerImage: "https://www.hplubricants.in/sites/default/files/15-W-40-Final-Graphic.jpg",
    description: "Ultra-heavy load open gear drives.",
    applicationAreas: "Ultra-heavy load open gear drives.",
    performanceBenefits: ["Synthetic film"],
    specialFeatures: [],
    specsText: "",
    tableHeaders: ["Property", "Value"],
    propertiesTable: [
      {
        property: "Viscosity @ 100°C",
        value: "1000 cSt",
      },
    ],
    pdfUrl: "/docs/TDS.pdf",
    msdsUrl: "/docs/MSDS.pdf",
    isFeatured: false,
    order: 20,
    createdAt: "2026-08-26T06:15:04.336Z",
    updatedAt: "2026-08-26T06:15:04.336Z",
  },
  {
    id: "prod-22",
    name: "NU-MATIC",
    slug: "nu-matic-grades",
    subtitle: "PNEUMATIC TOOL OILS",
    categorySlug: "industrial-oils",
    categoryName: "Industrial Oils",
    subCategoryTitle: "PNEUMATIC TOOL OILS",
    containerImage: "https://www.hplubricants.in/sites/default/files/15-W-40-Final-Graphic.jpg",
    description: "Air hammers and rock drills.",
    applicationAreas: "Air hammers and rock drills.",
    performanceBenefits: ["Emulsifies with moisture"],
    specialFeatures: [],
    specsText: "",
    tableHeaders: ["Property", "Value"],
    propertiesTable: [
      {
        property: "Viscosity",
        value: "ISO VG 46 / 100 / 320",
      },
    ],
    pdfUrl: "/docs/TDS.pdf",
    msdsUrl: "/docs/MSDS.pdf",
    isFeatured: false,
    order: 21,
    createdAt: "2026-08-26T06:15:04.336Z",
    updatedAt: "2026-08-26T06:15:04.336Z",
  },
  {
    id: "prod-23",
    name: "SEETUL GRADES",
    slug: "seetul-grades",
    subtitle: "REFRIGERATION OILS",
    categorySlug: "industrial-oils",
    categoryName: "Industrial Oils",
    subCategoryTitle: "REFRIGERATION COMPRESSOR OILS",
    containerImage: "https://www.hplubricants.in/sites/default/files/15-W-40-Final-Graphic.jpg",
    description: "Ammonia refrigeration compressors.",
    applicationAreas: "Ammonia refrigeration compressors.",
    performanceBenefits: ["Low pour point"],
    specialFeatures: [],
    specsText: "",
    tableHeaders: ["Property", "Value"],
    propertiesTable: [
      {
        property: "Type",
        value: "Mineral Refrigeration Oil",
      },
    ],
    pdfUrl: "/docs/TDS.pdf",
    msdsUrl: "/docs/MSDS.pdf",
    isFeatured: false,
    order: 22,
    createdAt: "2026-08-26T06:15:04.336Z",
    updatedAt: "2026-08-26T06:15:04.336Z",
  },
  {
    id: "prod-24",
    name: "SEETUL N 68 (P)",
    slug: "seetul-n-68",
    subtitle: "REFRIGERATION OILS",
    categorySlug: "industrial-oils",
    categoryName: "Industrial Oils",
    subCategoryTitle: "REFRIGERATION COMPRESSOR OILS",
    containerImage: "https://www.hplubricants.in/sites/default/files/15-W-40-Final-Graphic.jpg",
    description: "Cold storage refrigeration.",
    applicationAreas: "Cold storage refrigeration.",
    performanceBenefits: ["Ultra low floc point"],
    specialFeatures: [],
    specsText: "",
    tableHeaders: ["Property", "Value"],
    propertiesTable: [
      {
        property: "ISO VG",
        value: "68",
      },
    ],
    pdfUrl: "/docs/TDS.pdf",
    msdsUrl: "/docs/MSDS.pdf",
    isFeatured: false,
    order: 23,
    createdAt: "2026-08-26T06:15:04.336Z",
    updatedAt: "2026-08-26T06:15:04.336Z",
  },
  {
    id: "prod-25",
    name: "SEETUL RFL GRADES",
    slug: "seetul-rfl",
    subtitle: "REFRIGERATION OILS",
    categorySlug: "industrial-oils",
    categoryName: "Industrial Oils",
    subCategoryTitle: "REFRIGERATION COMPRESSOR OILS",
    containerImage: "https://www.hplubricants.in/sites/default/files/15-W-40-Final-Graphic.jpg",
    description: "Freon refrigerant systems.",
    applicationAreas: "Freon refrigerant systems.",
    performanceBenefits: ["Refrigerant compatibility"],
    specialFeatures: [],
    specsText: "",
    tableHeaders: ["Property", "Value"],
    propertiesTable: [
      {
        property: "Series",
        value: "RFL",
      },
    ],
    pdfUrl: "/docs/TDS.pdf",
    msdsUrl: "/docs/MSDS.pdf",
    isFeatured: false,
    order: 24,
    createdAt: "2026-08-26T06:15:04.336Z",
    updatedAt: "2026-08-26T06:15:04.336Z",
  },
  {
    id: "prod-26",
    name: "SEETUL S 68",
    slug: "seetul-s-68",
    subtitle: "REFRIGERATION OILS",
    categorySlug: "industrial-oils",
    categoryName: "Industrial Oils",
    subCategoryTitle: "REFRIGERATION COMPRESSOR OILS",
    containerImage: "https://www.hplubricants.in/sites/default/files/15-W-40-Final-Graphic.jpg",
    description: "Synthetic refrigeration compressor oil.",
    applicationAreas: "Synthetic refrigeration compressor oil.",
    performanceBenefits: ["High thermal resistance"],
    specialFeatures: [],
    specsText: "",
    tableHeaders: ["Property", "Value"],
    propertiesTable: [
      {
        property: "ISO VG",
        value: "68",
      },
    ],
    pdfUrl: "/docs/TDS.pdf",
    msdsUrl: "/docs/MSDS.pdf",
    isFeatured: false,
    order: 25,
    createdAt: "2026-08-26T06:15:04.336Z",
    updatedAt: "2026-08-26T06:15:04.336Z",
  },
  {
    id: "prod-27",
    name: "SEETUL SE 68",
    slug: "seetul-se-68",
    subtitle: "REFRIGERATION OILS",
    categorySlug: "industrial-oils",
    categoryName: "Industrial Oils",
    subCategoryTitle: "REFRIGERATION COMPRESSOR OILS",
    containerImage: "https://www.hplubricants.in/sites/default/files/15-W-40-Final-Graphic.jpg",
    description: "Polyolester POE synthetic oil.",
    applicationAreas: "Polyolester POE synthetic oil.",
    performanceBenefits: ["HFC compatible"],
    specialFeatures: [],
    specsText: "",
    tableHeaders: ["Property", "Value"],
    propertiesTable: [
      {
        property: "Base",
        value: "POE Synthetic",
      },
    ],
    pdfUrl: "/docs/TDS.pdf",
    msdsUrl: "/docs/MSDS.pdf",
    isFeatured: false,
    order: 26,
    createdAt: "2026-08-26T06:15:04.336Z",
    updatedAt: "2026-08-26T06:15:04.336Z",
  },
  {
    id: "prod-28",
    name: "SPINTEK",
    slug: "spintek-base",
    subtitle: "SPINDLE OILS",
    categorySlug: "industrial-oils",
    categoryName: "Industrial Oils",
    subCategoryTitle: "SPINDLE OILS",
    containerImage: "https://www.hplubricants.in/sites/default/files/15-W-40-Final-Graphic.jpg",
    description: "Textile spinning spindles.",
    applicationAreas: "Textile spinning spindles.",
    performanceBenefits: ["Ultra low viscosity"],
    specialFeatures: [],
    specsText: "",
    tableHeaders: ["Property", "Value"],
    propertiesTable: [
      {
        property: "Viscosity @ 40°C",
        value: "2 to 22 cSt",
      },
    ],
    pdfUrl: "/docs/TDS.pdf",
    msdsUrl: "/docs/MSDS.pdf",
    isFeatured: false,
    order: 27,
    createdAt: "2026-08-26T06:15:04.336Z",
    updatedAt: "2026-08-26T06:15:04.336Z",
  },
  {
    id: "prod-29",
    name: "SPINTEK 3",
    slug: "spintek-3",
    subtitle: "SPINDLE OILS",
    categorySlug: "industrial-oils",
    categoryName: "Industrial Oils",
    subCategoryTitle: "SPINDLE OILS",
    containerImage: "https://www.hplubricants.in/sites/default/files/15-W-40-Final-Graphic.jpg",
    description: "Ultra-high speed textile spindles.",
    applicationAreas: "Ultra-high speed textile spindles.",
    performanceBenefits: ["Low power consumption"],
    specialFeatures: [],
    specsText: "",
    tableHeaders: ["Property", "Value"],
    propertiesTable: [
      {
        property: "ISO VG",
        value: "3",
      },
    ],
    pdfUrl: "/docs/TDS.pdf",
    msdsUrl: "/docs/MSDS.pdf",
    isFeatured: false,
    order: 28,
    createdAt: "2026-08-26T06:15:04.336Z",
    updatedAt: "2026-08-26T06:15:04.336Z",
  },
  {
    id: "prod-30",
    name: "SPINTEK EE SERIES",
    slug: "spintek-ee-series",
    subtitle: "SPINDLE OILS",
    categorySlug: "industrial-oils",
    categoryName: "Industrial Oils",
    subCategoryTitle: "SPINDLE OILS",
    containerImage: "https://www.hplubricants.in/sites/default/files/15-W-40-Final-Graphic.jpg",
    description: "Energy efficient textile spindle lubricant.",
    applicationAreas: "Energy efficient textile spindle lubricant.",
    performanceBenefits: ["Friction modifier technology"],
    specialFeatures: [],
    specsText: "",
    tableHeaders: ["Property", "Value"],
    propertiesTable: [
      {
        property: "Series",
        value: "EE Series",
      },
    ],
    pdfUrl: "/docs/TDS.pdf",
    msdsUrl: "/docs/MSDS.pdf",
    isFeatured: false,
    order: 29,
    createdAt: "2026-08-26T06:15:04.336Z",
    updatedAt: "2026-08-26T06:15:04.336Z",
  },
  {
    id: "prod-31",
    name: "SPINTEK SYN 2",
    slug: "spintek-syn-2",
    subtitle: "SPINDLE OILS",
    categorySlug: "industrial-oils",
    categoryName: "Industrial Oils",
    subCategoryTitle: "SPINDLE OILS",
    containerImage: "https://www.hplubricants.in/sites/default/files/15-W-40-Final-Graphic.jpg",
    description: "Synthetic textile spindle fluid.",
    applicationAreas: "Synthetic textile spindle fluid.",
    performanceBenefits: ["Zero deposit formation"],
    specialFeatures: [],
    specsText: "",
    tableHeaders: ["Property", "Value"],
    propertiesTable: [
      {
        property: "ISO VG",
        value: "2",
      },
    ],
    pdfUrl: "/docs/TDS.pdf",
    msdsUrl: "/docs/MSDS.pdf",
    isFeatured: false,
    order: 30,
    createdAt: "2026-08-26T06:15:04.336Z",
    updatedAt: "2026-08-26T06:15:04.336Z",
  },
  {
    id: "prod-32",
    name: "STANTROL 1, 3",
    slug: "stantrol-1-3",
    subtitle: "STENTER OILS",
    categorySlug: "industrial-oils",
    categoryName: "Industrial Oils",
    subCategoryTitle: "STENTER OILS",
    containerImage: "https://www.hplubricants.in/sites/default/files/15-W-40-Final-Graphic.jpg",
    description: "Textile stenter machine conveyor chains up to 240°C.",
    applicationAreas: "Textile stenter machine conveyor chains up to 240°C.",
    performanceBenefits: ["Non-carbonizing high temperature synthetic oil"],
    specialFeatures: [],
    specsText: "",
    tableHeaders: ["Property", "Value"],
    propertiesTable: [
      {
        property: "Flash Point",
        value: "> 260°C",
      },
    ],
    pdfUrl: "/docs/TDS.pdf",
    msdsUrl: "/docs/MSDS.pdf",
    isFeatured: false,
    order: 31,
    createdAt: "2026-08-26T06:15:04.336Z",
    updatedAt: "2026-08-26T06:15:04.336Z",
  },
  {
    id: "prod-33",
    name: "CRUSHFINE 40 NB",
    slug: "crushfine-40-nb",
    subtitle: "SUGAR MILL OILS",
    categorySlug: "industrial-oils",
    categoryName: "Industrial Oils",
    subCategoryTitle: "SUGAR MILL BEARING OILS",
    containerImage: "https://www.hplubricants.in/sites/default/files/15-W-40-Final-Graphic.jpg",
    description: "Sugar mill crushing roller journal bearings.",
    applicationAreas: "Sugar mill crushing roller journal bearings.",
    performanceBenefits: ["Bitumen-free compounded oil"],
    specialFeatures: [],
    specsText: "",
    tableHeaders: ["Property", "Value"],
    propertiesTable: [
      {
        property: "Grade",
        value: "40 NB",
      },
    ],
    pdfUrl: "/docs/TDS.pdf",
    msdsUrl: "/docs/MSDS.pdf",
    isFeatured: false,
    order: 32,
    createdAt: "2026-08-26T06:15:04.336Z",
    updatedAt: "2026-08-26T06:15:04.336Z",
  },
  {
    id: "prod-34",
    name: "CRUSHFINE 45 NB-II",
    slug: "crushfine-45-nb-ii",
    subtitle: "SUGAR MILL OILS",
    categorySlug: "industrial-oils",
    categoryName: "Industrial Oils",
    subCategoryTitle: "SUGAR MILL BEARING OILS",
    containerImage: "https://www.hplubricants.in/sites/default/files/15-W-40-Final-Graphic.jpg",
    description: "Heavy duty sugar mill roll bearings.",
    applicationAreas: "Heavy duty sugar mill roll bearings.",
    performanceBenefits: ["High film strength"],
    specialFeatures: [],
    specsText: "",
    tableHeaders: ["Property", "Value"],
    propertiesTable: [
      {
        property: "Grade",
        value: "45 NB-II",
      },
    ],
    pdfUrl: "/docs/TDS.pdf",
    msdsUrl: "/docs/MSDS.pdf",
    isFeatured: false,
    order: 33,
    createdAt: "2026-08-26T06:15:04.336Z",
    updatedAt: "2026-08-26T06:15:04.336Z",
  },
  {
    id: "prod-35",
    name: "CRUSHFINE 60 NB-I",
    slug: "crushfine-60-nb-i",
    subtitle: "SUGAR MILL OILS",
    categorySlug: "industrial-oils",
    categoryName: "Industrial Oils",
    subCategoryTitle: "SUGAR MILL BEARING OILS",
    containerImage: "https://www.hplubricants.in/sites/default/files/15-W-40-Final-Graphic.jpg",
    description: "Sugar cane crusher bearings under high shock load.",
    applicationAreas: "Sugar cane crusher bearings under high shock load.",
    performanceBenefits: ["Anti-wear EP"],
    specialFeatures: [],
    specsText: "",
    tableHeaders: ["Property", "Value"],
    propertiesTable: [
      {
        property: "Grade",
        value: "60 NB-I",
      },
    ],
    pdfUrl: "/docs/TDS.pdf",
    msdsUrl: "/docs/MSDS.pdf",
    isFeatured: false,
    order: 34,
    createdAt: "2026-08-26T06:15:04.336Z",
    updatedAt: "2026-08-26T06:15:04.336Z",
  },
  {
    id: "prod-36",
    name: "CRUSHFINE 60 NB-II",
    slug: "crushfine-60-nb-ii",
    subtitle: "SUGAR MILL OILS",
    categorySlug: "industrial-oils",
    categoryName: "Industrial Oils",
    subCategoryTitle: "SUGAR MILL BEARING OILS",
    containerImage: "https://www.hplubricants.in/sites/default/files/15-W-40-Final-Graphic.jpg",
    description: "High capacity sugar mill rollers.",
    applicationAreas: "High capacity sugar mill rollers.",
    performanceBenefits: ["Water resistance"],
    specialFeatures: [],
    specsText: "",
    tableHeaders: ["Property", "Value"],
    propertiesTable: [
      {
        property: "Grade",
        value: "60 NB-II",
      },
    ],
    pdfUrl: "/docs/TDS.pdf",
    msdsUrl: "/docs/MSDS.pdf",
    isFeatured: false,
    order: 35,
    createdAt: "2026-08-26T06:15:04.336Z",
    updatedAt: "2026-08-26T06:15:04.336Z",
  },
  {
    id: "prod-37",
    name: "CRUSHWELL 1, 2, 3, 4, 5",
    slug: "crushwell-series",
    subtitle: "SUGAR MILL OILS",
    categorySlug: "industrial-oils",
    categoryName: "Industrial Oils",
    subCategoryTitle: "SUGAR MILL BEARING OILS",
    containerImage: "https://www.hplubricants.in/sites/default/files/15-W-40-Final-Graphic.jpg",
    description: "All grades of sugar mill crusher bearings.",
    applicationAreas: "All grades of sugar mill crusher bearings.",
    performanceBenefits: ["High viscosity compounded oil"],
    specialFeatures: [],
    specsText: "",
    tableHeaders: ["Property", "Value"],
    propertiesTable: [
      {
        property: "Grades",
        value: "1 to 5",
      },
    ],
    pdfUrl: "/docs/TDS.pdf",
    msdsUrl: "/docs/MSDS.pdf",
    isFeatured: false,
    order: 36,
    createdAt: "2026-08-26T06:15:04.336Z",
    updatedAt: "2026-08-26T06:15:04.336Z",
  },
  {
    id: "prod-38",
    name: "HP TRANSFORMER OIL I",
    slug: "hp-transformer-oil-1",
    subtitle: "TRANSFORMER OILS",
    categorySlug: "industrial-oils",
    categoryName: "Industrial Oils",
    subCategoryTitle: "TRANSFORMER OILS",
    containerImage: "https://www.hplubricants.in/sites/default/files/15-W-40-Final-Graphic.jpg",
    description: "Electrical insulation in power transformers.",
    applicationAreas: "Electrical insulation in power transformers.",
    performanceBenefits: ["High breakdown voltage >70 kV"],
    specialFeatures: [],
    specsText: "",
    tableHeaders: ["Property", "Value"],
    propertiesTable: [
      {
        property: "IS Standard",
        value: "IS 335",
      },
    ],
    pdfUrl: "/docs/POWERTRAN_TDS.pdf",
    msdsUrl: "/docs/POWERTRAN_MSDS.pdf",
    isFeatured: false,
    order: 37,
    createdAt: "2026-08-26T06:15:04.336Z",
    updatedAt: "2026-08-26T06:15:04.336Z",
  },
  {
    id: "prod-39",
    name: "HP TRANSFORMER OILS",
    slug: "hp-transformer-oils",
    subtitle: "TRANSFORMER OILS",
    categorySlug: "industrial-oils",
    categoryName: "Industrial Oils",
    subCategoryTitle: "TRANSFORMER OILS",
    containerImage: "https://www.hplubricants.in/sites/default/files/15-W-40-Final-Graphic.jpg",
    description: "Distribution transformers and switchgear.",
    applicationAreas: "Distribution transformers and switchgear.",
    performanceBenefits: ["Low Tan Delta"],
    specialFeatures: [],
    specsText: "",
    tableHeaders: ["Property", "Value"],
    propertiesTable: [
      {
        property: "Type",
        value: "Uninhibited",
      },
    ],
    pdfUrl: "/docs/POWERTRAN_TDS.pdf",
    msdsUrl: "/docs/POWERTRAN_MSDS.pdf",
    isFeatured: false,
    order: 38,
    createdAt: "2026-08-26T06:15:04.336Z",
    updatedAt: "2026-08-26T06:15:04.336Z",
  },
  {
    id: "prod-40",
    name: "TURBINOL",
    slug: "turbinol-base",
    subtitle: "TURBINE OILS",
    categorySlug: "industrial-oils",
    categoryName: "Industrial Oils",
    subCategoryTitle: "TURBINE OILS",
    containerImage: "https://www.hplubricants.in/sites/default/files/15-W-40-Final-Graphic.jpg",
    description: "Steam, gas, and hydro turbines.",
    applicationAreas: "Steam, gas, and hydro turbines.",
    performanceBenefits: ["TOST life > 3500 hours", "Water demulsibility"],
    specialFeatures: [],
    specsText: "",
    tableHeaders: ["Property", "Value"],
    propertiesTable: [
      {
        property: "ISO VG",
        value: "32 / 46 / 68",
      },
    ],
    pdfUrl: "/docs/TURBINOL_TDS.pdf",
    msdsUrl: "/docs/TURBINOL_MSDS.pdf",
    isFeatured: false,
    order: 39,
    createdAt: "2026-08-26T06:15:04.336Z",
    updatedAt: "2026-08-26T06:15:04.336Z",
  },
  {
    id: "prod-41",
    name: "TURBINOL LP",
    slug: "turbinol-lp",
    subtitle: "TURBINE OILS",
    categorySlug: "industrial-oils",
    categoryName: "Industrial Oils",
    subCategoryTitle: "TURBINE OILS",
    containerImage: "https://www.hplubricants.in/sites/default/files/15-W-40-Final-Graphic.jpg",
    description: "Long life turbine oil.",
    applicationAreas: "Long life turbine oil.",
    performanceBenefits: ["High thermal stability"],
    specialFeatures: [],
    specsText: "",
    tableHeaders: ["Property", "Value"],
    propertiesTable: [
      {
        property: "Series",
        value: "LP",
      },
    ],
    pdfUrl: "/docs/TDS.pdf",
    msdsUrl: "/docs/MSDS.pdf",
    isFeatured: false,
    order: 40,
    createdAt: "2026-08-26T06:15:04.336Z",
    updatedAt: "2026-08-26T06:15:04.336Z",
  },
  {
    id: "prod-42",
    name: "TURBINOL XT",
    slug: "turbinol-xt",
    subtitle: "TURBINE OILS",
    categorySlug: "industrial-oils",
    categoryName: "Industrial Oils",
    subCategoryTitle: "TURBINE OILS",
    containerImage: "https://www.hplubricants.in/sites/default/files/15-W-40-Final-Graphic.jpg",
    description: "Extreme temperature gas turbine bearings.",
    applicationAreas: "Extreme temperature gas turbine bearings.",
    performanceBenefits: ["Synthetic turbine oil"],
    specialFeatures: [],
    specsText: "",
    tableHeaders: ["Property", "Value"],
    propertiesTable: [
      {
        property: "Series",
        value: "XT",
      },
    ],
    pdfUrl: "/docs/TDS.pdf",
    msdsUrl: "/docs/MSDS.pdf",
    isFeatured: false,
    order: 41,
    createdAt: "2026-08-26T06:15:04.336Z",
    updatedAt: "2026-08-26T06:15:04.336Z",
  },
  {
    id: "prod-43",
    name: "HP METWIRE NB",
    slug: "hp-metwire-nb",
    subtitle: "WIRE ROPE LUBRICANTS",
    categorySlug: "industrial-oils",
    categoryName: "Industrial Oils",
    subCategoryTitle: "WIRE ROPE LUBRICANTS",
    containerImage: "https://www.hplubricants.in/sites/default/files/15-W-40-Final-Graphic.jpg",
    description: "Steel wire ropes in cranes, hoists, and elevators.",
    applicationAreas: "Steel wire ropes in cranes, hoists, and elevators.",
    performanceBenefits: ["Deep strand penetration"],
    specialFeatures: [],
    specsText: "",
    tableHeaders: ["Property", "Value"],
    propertiesTable: [
      {
        property: "Type",
        value: "Non-bituminous",
      },
    ],
    pdfUrl: "/docs/TDS.pdf",
    msdsUrl: "/docs/MSDS.pdf",
    isFeatured: false,
    order: 42,
    createdAt: "2026-08-26T06:15:04.336Z",
    updatedAt: "2026-08-26T06:15:04.336Z",
  },
  {
    id: "prod-44",
    name: "RODEC 120",
    slug: "rodec-120",
    subtitle: "WIRE ROPE LUBRICANTS",
    categorySlug: "industrial-oils",
    categoryName: "Industrial Oils",
    subCategoryTitle: "WIRE ROPE LUBRICANTS",
    containerImage: "https://www.hplubricants.in/sites/default/files/15-W-40-Final-Graphic.jpg",
    description: "Heavy duty crane wire ropes.",
    applicationAreas: "Heavy duty crane wire ropes.",
    performanceBenefits: ["Tacky coating"],
    specialFeatures: [],
    specsText: "",
    tableHeaders: ["Property", "Value"],
    propertiesTable: [
      {
        property: "Grade",
        value: "120",
      },
    ],
    pdfUrl: "/docs/TDS.pdf",
    msdsUrl: "/docs/MSDS.pdf",
    isFeatured: false,
    order: 43,
    createdAt: "2026-08-26T06:15:04.336Z",
    updatedAt: "2026-08-26T06:15:04.336Z",
  },
  {
    id: "prod-45",
    name: "HP ALPLEX 2",
    slug: "hp-alplex-2",
    subtitle: "INDUSTRIAL GREASES",
    categorySlug: "industrial-greases",
    categoryName: "Industrial Greases",
    subCategoryTitle: "INDUSTRIAL GREASES",
    containerImage: "https://www.hplubricants.in/sites/default/files/15-W-40-Final-Graphic.jpg",
    description:
      "Lithium complex extreme pressure grease for steel rolling mills and heavy bearings.",
    applicationAreas:
      "Lithium complex extreme pressure grease for steel rolling mills and heavy bearings.",
    performanceBenefits: ["Drop point >260°C", "High load bearing capacity"],
    specialFeatures: [],
    specsText: "IS 14847:2000 NLGI 2",
    tableHeaders: ["Property", "Value"],
    propertiesTable: [
      {
        property: "Drop Point",
        value: "> 260°C",
      },
    ],
    pdfUrl: "/docs/ALPLEX_TDS.pdf",
    msdsUrl: "/docs/ALPLEX_MSDS.pdf",
    isFeatured: false,
    order: 44,
    createdAt: "2026-08-26T06:15:04.336Z",
    updatedAt: "2026-08-26T06:15:04.336Z",
  },
  {
    id: "prod-46",
    name: "HP AP3 LL (B)",
    slug: "hp-ap3-ll",
    subtitle: "INDUSTRIAL GREASES",
    categorySlug: "industrial-greases",
    categoryName: "Industrial Greases",
    subCategoryTitle: "INDUSTRIAL GREASES",
    containerImage: "https://www.hplubricants.in/sites/default/files/15-W-40-Final-Graphic.jpg",
    description: "All-purpose grease for anti-friction bearings, chassis, and water pumps.",
    applicationAreas: "All-purpose grease for anti-friction bearings, chassis, and water pumps.",
    performanceBenefits: ["High structural shear stability"],
    specialFeatures: [],
    specsText: "",
    tableHeaders: ["Property", "Value"],
    propertiesTable: [
      {
        property: "NLGI Grade",
        value: "3",
      },
    ],
    pdfUrl: "/docs/AP3_TDS.pdf",
    msdsUrl: "/docs/AP3_MSDS.pdf",
    isFeatured: false,
    order: 45,
    createdAt: "2026-08-26T06:15:04.336Z",
    updatedAt: "2026-08-26T06:15:04.336Z",
  },
  {
    id: "prod-47",
    name: "HP KISAN SHAKTI",
    slug: "hp-kisan-shakti",
    subtitle: "AGRICULTURE OILS",
    categorySlug: "automotive-oils",
    categoryName: "Automotive Oils",
    subCategoryTitle: "AGRICULTURE OILS",
    containerImage: "https://www.hplubricants.in/sites/default/files/15-W-40-Final-Graphic.jpg",
    description:
      "Formulated specifically for tractors and pump sets used in heavy agricultural operations.",
    applicationAreas:
      "Formulated specifically for tractors and pump sets used in heavy agricultural operations.",
    performanceBenefits: [
      "High engine protection against dust",
      "Shear stability under continuous tilling",
    ],
    specialFeatures: [],
    specsText: "API CF/SF, IS 13656 E-DL2",
    tableHeaders: ["Property", "Value"],
    propertiesTable: [
      {
        property: "SAE Viscosity Grade",
        value: "20W-40",
      },
    ],
    pdfUrl: "/docs/HP_KISAN_SHAKTI_TDS.pdf",
    msdsUrl: "/docs/HP_KISAN_SHAKTI_MSDS.pdf",
    isFeatured: false,
    order: 46,
    createdAt: "2026-08-26T06:15:04.336Z",
    updatedAt: "2026-08-26T06:15:04.336Z",
  },
  {
    id: "prod-48",
    name: "HP SUPER DUTY BRAKE FLUID DOT 3",
    slug: "hp-super-duty-brake-fluid-dot-3",
    subtitle: "BRAKE FLUIDS",
    categorySlug: "automotive-oils",
    categoryName: "Automotive Oils",
    subCategoryTitle: "BRAKE FLUIDS",
    containerImage: "https://www.hplubricants.in/sites/default/files/15-W-40-Final-Graphic.jpg",
    description: "Hydraulic brake and clutch systems in passenger cars, trucks, and buses.",
    applicationAreas: "Hydraulic brake and clutch systems in passenger cars, trucks, and buses.",
    performanceBenefits: ["High boiling point preventing vapor lock"],
    specialFeatures: [],
    specsText: "",
    tableHeaders: ["Property", "Value"],
    propertiesTable: [
      {
        property: "ERBP, °C",
        value: "> 230",
      },
    ],
    pdfUrl: "/docs/DOT3_TDS.pdf",
    msdsUrl: "/docs/DOT3_MSDS.pdf",
    isFeatured: false,
    order: 47,
    createdAt: "2026-08-26T06:15:04.336Z",
    updatedAt: "2026-08-26T06:15:04.336Z",
  },
  {
    id: "prod-49",
    name: "HP RACER 4T 20W-40",
    slug: "hp-racer-4t-20w40",
    subtitle: "SCOOTER & BIKE OILS",
    categorySlug: "bike-oils",
    categoryName: "Bike Engine Oils",
    subCategoryTitle: "SCOOTER & BIKE OILS",
    containerImage: "https://www.hplubricants.in/sites/default/files/15-W-40-Final-Graphic.jpg",
    description: "4-stroke motorcycles from Hero, Honda, Bajaj, TVS, Yamaha, and Royal Enfield.",
    applicationAreas:
      "4-stroke motorcycles from Hero, Honda, Bajaj, TVS, Yamaha, and Royal Enfield.",
    performanceBenefits: ["JASO MA2 wet clutch friction control", "Smooth gear shifting"],
    specialFeatures: [],
    specsText: "",
    tableHeaders: ["Property", "Value"],
    propertiesTable: [
      {
        property: "SAE Grade",
        value: "20W-40",
      },
    ],
    pdfUrl: "/docs/RACER_20W40_TDS.pdf",
    msdsUrl: "/docs/RACER_20W40_MSDS.pdf",
    isFeatured: false,
    order: 48,
    createdAt: "2026-08-26T06:15:04.336Z",
    updatedAt: "2026-08-26T06:15:04.336Z",
  },
];

let mockBlogs: any[] = [
  {
    id: "blog-1",
    title: "How Often Should You Change Your Automotive Engine Oil? A Simple Guide",
    slug: "how-often-should-you-change-your-automotive-engine-oil",
    category: "Automotive",
    publishDate: "October 14, 2025",
    readTime: "6 min read",
    author: "HPCL Lubricants Technical Team",
    excerpt:
      "Regular oil changes are vital for the longevity and efficiency of your vehicle and machinery. Learn key factors, recommended mileage intervals, synthetic vs conventional oils, and oil condition monitoring.",
    coverImage:
      "https://www.hplubricants.in/sites/default/files/How-Often-Should-You-Change-Your-Automotive-Engine-Oil.jpg",
    content: {
      intro:
        "Regular oil changes are vital for the longevity and efficiency of your machinery, whether it's a car, industrial equipment, or a small engine like a lawnmower. However, determining the right interval for oil changes can be confusing due to various factors that influence oil life. This guide will help you understand how often you should change your Automotive Engine Oil and what factors to consider.",
      sections: [
        {
          heading: "1. Follow the Manufacturer’s Recommendations",
          paragraphs: [
            "Every vehicle manufacturer specifies precise lubrication intervals tailored to engine design and tolerances.",
          ],
          bulletPoints: [
            "Owner’s Manual: The best starting point is always your machine’s owner’s manual. Manufacturers provide specific guidelines on oil change intervals based on rigorous testing and engineering.",
            "Service Schedules: Service schedules detail recommended oil change frequency based on factors like usage, engine type, and operating conditions.",
          ],
        },
        {
          heading: "2. Consider the Type of Oil Used",
          paragraphs: [
            "The chemical formulation of your lubricant directly dictates how long it maintains its protective viscosity and detergent properties:",
          ],
          bulletPoints: [
            "Conventional Oil: Needs to be changed more frequently, typically every 3,000 to 5,000 miles (5,000–7,500 km) for vehicles or every 100-200 hours for machinery.",
            "Synthetic Oil: Due to superior molecular stability, synthetic oils last longer and require changes every 7,500 to 10,000 miles (10,000–15,000 km) or 300-500 operating hours.",
            "Synthetic Blend Oil: Combines synthetic and mineral basestocks for a middle ground, extending intervals slightly beyond conventional oils.",
            "High-Mileage Oil: Formulated with seal conditioners for older engines with over 75,000 miles to reduce oil consumption and seal leakage.",
          ],
        },
        {
          heading: "3. Evaluate Your Usage Patterns",
          paragraphs: [
            "Your daily driving style and vehicle workload heavily influence thermal breakdown rates:",
          ],
          bulletPoints: [
            "Frequent Short Trips: Short city trips prevent the engine from reaching optimal operating temperatures, promoting moisture condensation and fuel dilution in the oil.",
            "Heavy Loads and High Stress: Vehicles operating under continuous heavy loads or towing generate elevated internal heat, breaking down additives faster.",
            "Infrequent Use: Vehicles or seasonal machinery driven rarely still require time-based oil changes, as stagnant oil oxidizes and absorbs ambient moisture.",
          ],
        },
        {
          heading: "4. Consider Environmental Conditions",
          paragraphs: ["Ambient temperature extremes and air purity alter lubricant performance:"],
          bulletPoints: [
            "Extreme Temperatures: Very hot weather accelerates oil oxidation, while severe cold thickens oil, demanding low-viscosity winter grades and timely replacements.",
            "Dusty or Dirty Environments: Off-road or unpaved driving allows airborne silica dust into the engine, requiring shorter oil and filter change intervals.",
          ],
        },
        {
          heading: "5. Monitor Oil Quality",
          paragraphs: [
            "Proactive visual and chemical oil checks help catch breakdown before mechanical wear occurs:",
          ],
          bulletPoints: [
            "Check Oil Level & Condition: Pull the dipstick regularly. Dark, gritty, sludge-like oil or a burnt odor indicates urgent replacement is needed.",
            "Oil Analysis: For heavy fleet operations or industrial equipment, laboratory oil analysis monitors wear metals, soot percentage, and remaining TBN.",
          ],
        },
        {
          heading: "6. Listen to Your Machine",
          paragraphs: [
            "Your vehicle provides clear physical signals when oil lubrication breaks down:",
          ],
          bulletPoints: [
            "Unusual Noises or Performance Issues: Increased engine knocking, valve ticking, or sluggish response indicates friction buildup from degraded oil.",
            "Dashboard Alerts: Pay attention to low oil pressure lights or automated oil life monitoring indicators and service promptly.",
          ],
        },
        {
          heading: "7. Factor in the Age of the Machine",
          paragraphs: ["Engine age changes internal clearances and blow-by gas generation:"],
          bulletPoints: [
            "Older Engines: Higher wear clearances cause faster oil contamination and consumption, benefiting from shorter change cycles and high-viscosity protection.",
            "Newer Machines: Modern precision-machined engines with active emissions control systems support extended intervals when paired with premium synthetic oils.",
          ],
        },
        {
          heading: "8. Time-Based Changes",
          paragraphs: [
            "Oil Degradation Over Time: Even when mileage is low, exposure to air, moisture, and acid combustion byproducts breaks down additives. Always change engine oil at least once every 12 months.",
          ],
        },
      ],
      conclusion:
        "The frequency of oil changes depends on a variety of factors, including the type of oil, usage patterns, environmental conditions, and the machine's age. While following the manufacturer’s guidelines is crucial, being mindful of your specific operating conditions and regularly checking your oil can ensure your machine runs smoothly and efficiently. Regular oil changes are a simple yet vital maintenance task that protects your machine and keeps it performing at its best.",
      recommendedProducts: ["HP FUTUR-X 5W-30", "HP MILCY TURBO STAR 15W-40", "HP RACER 4T 20W-40"],
    },
    recommendedProducts: [],
    isPublished: true,
    createdAt: "2026-08-26T06:15:04.336Z",
    updatedAt: "2026-08-26T06:15:04.336Z",
  },
  {
    id: "blog-2",
    title: "How To Choose The Right Diesel Engine Oil For Your Vehicle",
    slug: "how-to-choose-the-right-diesel-engine-oil-for-your-vehicle",
    category: "Automotive",
    publishDate: "November 02, 2025",
    readTime: "7 min read",
    author: "HPCL Lubricants Technical Expert",
    excerpt:
      "A comprehensive guide to selecting the ideal diesel engine oil, understanding SAE viscosity ratings, API standards, OEM approvals, and engine protection.",
    coverImage:
      "https://www.hplubricants.in/sites/default/files/How-To-Choose-The-Right-Diesel-Engine-Oil-For-Your-Vehicle.jpg",
    content: {
      intro:
        "Choosing the right Diesel Engine Oil is crucial for the longevity and performance of your vehicle. Heavy-duty diesel engines operate under extreme pressures and thermal stress. With so many options available in the market, making an informed decision can be challenging. This guide will help you navigate the key factors to consider when selecting the best Diesel Engine Oil for your vehicle.",
      sections: [
        {
          heading: "1. Understand Your Vehicle's Requirements",
          paragraphs: [
            "Every vehicle has unique lubrication demands based on its engine design, emission systems, and operational duties.",
          ],
          bulletPoints: [
            "Owner's Manual: Always consult your vehicle's owner's manual first. It provides specific recommendations for the required viscosity grade and API service specification best suited for your engine.",
            "Engine Type: Diesel engines vary widely—from light passenger SUVs to heavy commercial trucks and tractors. High-performance turbo-diesel engines often require synthetic formulations, whereas conventional oils suffice for older, simpler engines.",
          ],
        },
        {
          heading: "2. Know the Different Types of Diesel Engine Oils",
          paragraphs: [
            "Engine oils are classified into several categories based on base oil refinement and synthetic formulation:",
          ],
          bulletPoints: [
            "Conventional Diesel Engine Oil: Refined directly from crude oil, conventional oil is affordable and ideal for older engines with routine maintenance schedules.",
            "Synthetic Diesel Engine Oil: Chemically synthesized for uniform molecular structure, delivering superior thermal stability, oxidation resistance, and performance in extreme cold or high-heat conditions.",
            "Synthetic Blend Diesel Engine Oil: A mixture of synthetic and mineral basestocks offering enhanced protection over conventional oil at a balanced cost.",
            "High-Mileage Diesel Engine Oil: Specifically formulated for engines with over 75,000 km, containing seal conditioners and anti-wear agents to reduce oil consumption and minimize leaks.",
          ],
        },
        {
          heading: "3. Consider the Viscosity Rating (SAE Grade)",
          paragraphs: [
            "Viscosity measures an oil's resistance to flow across varying operating temperatures:",
          ],
          bulletPoints: [
            "Understanding Viscosity Ratings: SAE multigrade ratings (such as 15W-40 or 10W-30) indicate performance. The number preceding 'W' (Winter) represents cold flow behavior, while the second number indicates high-temperature thickness at 100°C.",
            "Climate Considerations: In colder regions or winter seasons, lower ratings like 5W-40 or 10W-30 ensure instant cold-start oil circulation. In hotter climates like Indian summers, 15W-40 or 20W-50 grades maintain heavy film strength under load.",
          ],
        },
        {
          heading: "4. Look for Certifications & OEM Approvals",
          paragraphs: [
            "Ensure your lubricant meets international performance standards and vehicle manufacturer guidelines:",
          ],
          bulletPoints: [
            "API Standards (CK-4 / CI-4 Plus): Look for API donut marks. API CK-4 and CJ-4 low-SAPS oils are mandatory for modern BS-VI engines equipped with DPF and SCR systems, while API CI-4 Plus is ideal for BS-IV fleets.",
            "OEM Approvals: Top lubricants distributed by MAHALAXMI ENTERPRISES carry OEM approvals from major vehicle manufacturers (Tata Motors, Ashok Leyland, Mahindra, Cummins), giving extra assurance of performance.",
          ],
        },
        {
          heading: "5. Consider the Oil Change Interval",
          paragraphs: ["Oil change frequency impacts total cost of ownership and vehicle uptime:"],
          bulletPoints: [
            "Extended Drain Intervals: Premium synthetic oils (like HP MILCY TURBO ULTIMA) are engineered for extended drain intervals, keeping commercial fleets on the road longer.",
            "Conventional Oils: Require more frequent oil changes, suitable for lower annual mileage or budget-conscious operations.",
          ],
        },
        {
          heading: "6. Assess Your Driving Habits & Duty Cycle",
          paragraphs: ["Severe operating conditions demand higher specification lubricants:"],
          bulletPoints: [
            "Heavy Hauling & Towing: Operating fully loaded trucks or agricultural equipment generates massive internal heat, requiring shear-stable synthetic or heavy-duty multigrade lubricants.",
            "City Stop-and-Go Driving: Urban delivery fleets encounter frequent idling and start-stop cycles, requiring high anti-wear (ZDDP) protection.",
          ],
        },
        {
          heading: "7. Evaluate the Oil's Additive Package",
          paragraphs: [
            "Performance additives protect internal engine components against soot and deposit buildup:",
          ],
          bulletPoints: [
            "Detergents & Dispersants: Neutralize combustion acids and keep soot particles suspended to prevent engine sludge formation.",
            "Anti-Wear Agents: Form a sacrificial barrier on camshafts and piston rings to eliminate metal-to-metal contact.",
            "Viscosity Index Improvers: Maintain stable lubricant viscosity across extreme temperature variations.",
          ],
        },
        {
          heading: "8. Cost vs. Performance",
          paragraphs: [
            "Weigh short-term lubricant costs against long-term fuel efficiency, reduced maintenance, and engine overhaul prevention. Investing in high-grade lubricants from MAHALAXMI ENTERPRISES saves significant operating costs over time.",
          ],
        },
      ],
      conclusion:
        "Selecting the right Diesel Engine Oil requires balancing vehicle manufacturer specifications, climate conditions, duty cycles, and budget. Choosing HP MILCY series diesel lubricants from Mahalaxmi Enterprises ensures maximum engine protection, extended drain intervals, and optimal fuel economy for your commercial fleet or personal vehicle.",
      recommendedProducts: [
        "HP MILCY TURBO ULTIMA 10W-40",
        "HP MILCY POWER 15W-40",
        "HP DIESELINO 15W-40T",
      ],
    },
    recommendedProducts: [],
    isPublished: true,
    createdAt: "2026-08-26T06:15:04.336Z",
    updatedAt: "2026-08-26T06:15:04.336Z",
  },
  {
    id: "blog-3",
    title: "15W-40 Oil: Types, Properties, and Uses",
    slug: "15w-40-oil-and-types",
    category: "Automotive",
    publishDate: "December 18, 2025",
    readTime: "7 min read",
    author: "HPCL Lubricants Technical Expert",
    excerpt:
      "15W-40 is a widely used multi-grade engine oil known for its versatility and performance in commercial transport, agricultural tractors, and industrial generators.",
    coverImage: "https://www.hplubricants.in/sites/default/files/15-W-40-Final-Graphic.jpg",
    content: {
      intro:
        "15W-40 oil is a widely used multi-grade engine oil, known for its versatility and performance in various temperatures and operating conditions. This guide provides an in-depth look at 15W-40 oil, exploring its types, properties, uses, and maintenance tips to help you make informed decisions for your vehicle or machinery.",
      sections: [
        {
          heading: "1. Introduction to 15W-40 Oil",
          paragraphs: [
            "15W-40 oil is a multi-grade engine oil, meaning its viscosity rating adapts across temperature ranges. The '15W' specifies the cold-temperature pumping viscosity (Winter rating), while '40' indicates kinematic viscosity at 100°C. This dual rating guarantees reliable cold starts and robust film thickness during continuous heavy operations.",
          ],
        },
        {
          heading: "2. Types of 15W-40 Engine Oil",
          paragraphs: [
            "15W-40 lubricants are available in conventional, synthetic blend, and full synthetic formulations:",
          ],
          bulletPoints: [
            "Conventional 15W-40 Oil: Refined directly from crude oil, providing solid lubrication for older commercial diesel engines at an economical cost.",
            "Synthetic Blend 15W-40 Oil: Combines mineral base stocks with synthetic compounds for superior oxidation resistance, enhanced engine cleanliness, and extended drain capability.",
            "Full Synthetic 15W-40 Oil: Engineered from high-purity synthetic base oils for maximum thermal stability, minimal oil volatility, and peak fuel efficiency.",
          ],
        },
        {
          heading: "3. Key Properties of 15W-40 Oil",
          paragraphs: ["Four essential physical properties define 15W-40 performance:"],
          bulletPoints: [
            "Viscosity Stability: Maintains protective oil film across severe cold and intense heat.",
            "Thermal Breakdown Resistance: Resists sludge and varnish formation at high engine operating temperatures.",
            "Detergency & Dispersancy: Keeps soot particles suspended to prevent carbon deposits and ring sticking.",
            "Anti-Wear Protection: Forms sacrificial ZDDP films over cams, lifters, and bearings.",
          ],
        },
        {
          heading: "4. Applications Across Industries",
          paragraphs: ["15W-40 is specified across multiple heavy-duty sectors:"],
          bulletPoints: [
            "Commercial Fleet Trucks: Long-haul logistics trucks, tippers, and buses.",
            "Agricultural Tractors & Harvesters: Heavy field machinery operating under high torque.",
            "Industrial Gensets & Excavators: Construction machinery and stationary diesel power generators.",
          ],
        },
      ],
      conclusion:
        "Trust the HP MILCY 15W-40 series from Mahalaxmi Enterprises for exceptional engine cleanliness, reduced oil consumption, and long-term machinery protection.",
      recommendedProducts: [
        "HP MILCY TURBO STAR 15W-40",
        "HP MILCY SUPER 15W-40",
        "HP MILCY POWER 15W-40",
      ],
    },
    recommendedProducts: [],
    isPublished: true,
    createdAt: "2026-08-26T06:15:04.336Z",
    updatedAt: "2026-08-26T06:15:04.336Z",
  },
  {
    id: "blog-4",
    title: "Transformer Oil: Types, Properties, and Uses",
    slug: "transformer-oil-types-properties-and-uses",
    category: "Industrial",
    publishDate: "January 10, 2026",
    readTime: "8 min read",
    author: "HP Industrial Lubricants Team",
    excerpt:
      "Discover the electrical insulation, active cooling properties, dielectric breakdown voltage standards, and maintenance requirements for electrical transformer fluids.",
    coverImage: "https://www.hplubricants.in/sites/default/files/Transformer-oil-final.jpg",
    content: {
      intro:
        "Transformer oil (dielectric insulating fluid) is a vital component in high-voltage electrical transformers. It serves two essential functions: providing electrical insulation between active conductors and dissipating intense heat generated within core windings. This comprehensive guide covers transformer oil formulations, testing, and maintenance practices.",
      sections: [
        {
          heading: "1. Types of Transformer Oil",
          paragraphs: [
            "Transformer fluids are categorized into mineral-based and synthetic dielectric fluids:",
          ],
          bulletPoints: [
            "Paraffinic Transformer Oil: Derived from paraffinic crudes; offers lower oxidation rates but higher pour points requiring pour depressants.",
            "Naphthenic Transformer Oil: Highly refined from naphthenic crudes; provides excellent low-temperature fluidity and superior sludge solubility.",
            "Synthetic Ester & Silicone Oils: Fire-resistant and biodegradable fluids specified for indoor substations, offshore rigs, and environmentally sensitive zones.",
          ],
        },
        {
          heading: "2. Key Physical & Electrical Properties",
          paragraphs: [
            "To safeguard high-voltage equipment, transformer oils must meet rigid specifications:",
          ],
          bulletPoints: [
            "Dielectric Breakdown Voltage (>70 kV): High electrical resistance prevents flashover and arcing inside the tank.",
            "Low Dissipation Factor (Tan Delta): Low dielectric loss minimizes energy dissipation as heat.",
            "High Flash Point (>140°C): High thermal threshold minimizes flammability and explosive risk.",
            "Oxidation Stability: Inhibited formulations prevent acid and sludge formation during decades of continuous service.",
          ],
        },
        {
          heading: "3. Maintenance & Quality Monitoring",
          paragraphs: ["Regular oil condition monitoring ensures grid reliability:"],
          bulletPoints: [
            "Dissolved Gas Analysis (DGA): Tests for thermal fault gases (hydrogen, methane, acetylene) to detect internal insulation breakdown.",
            "Vacuum Filtration & Dehydration: Removes dissolved moisture and particulate debris to restore dielectric strength.",
            "Reclamation & Regeneration: Restores aged oil properties via fuller's earth treatment.",
          ],
        },
      ],
      conclusion:
        "HP POWERTRAN transformer dielectric fluids comply with IS 335 and IEC 60296 standards, delivering maximum safety and uninterrupted grid reliability.",
      recommendedProducts: ["HP POWERTRAN", "HP ENKLO 68", "HP HYDROL 68"],
    },
    recommendedProducts: [],
    isPublished: true,
    createdAt: "2026-08-26T06:15:04.336Z",
    updatedAt: "2026-08-26T06:15:04.336Z",
  },
  {
    id: "blog-5",
    title: "Bike Engine Oil: Complete Selection & Performance Guide",
    slug: "bike-engine-oil",
    category: "Bike Oils",
    publishDate: "January 24, 2026",
    readTime: "6 min read",
    author: "HP Two-Wheeler Lubricant Advisory",
    excerpt:
      "Learn how 4T bike engine oils protect the engine, wet clutch, and transmission gears, while managing heat in city traffic and high-RPM riding.",
    coverImage: "https://www.hplubricants.in/sites/default/files/Bike-Engine-Oil-Final-Graphic.jpg",
    content: {
      intro:
        "The motorcycle universe is exhilarating. Riding brings freedom, but keeping your bike performing at its limit requires proper engine care. Unlike passenger cars where engine and gearbox use separate oils, 4-stroke motorcycles share a single oil bath for the engine, wet clutch, and transmission gears.",
      sections: [
        {
          heading: "1. Essential Functions of Two-Wheeler Engine Oil",
          paragraphs: ["Motorcycle lubricants perform four crucial duties simultaneously:"],
          bulletPoints: [
            "Lubrication: Reduces metal-on-metal friction between piston rings, camshafts, and transmission gears.",
            "Heat Dissipation: Carries heat away from combustion chambers and clutch plates during continuous high-RPM operation.",
            "Cleaning: Suspends carbon deposits and combustion debris, keeping oil passages clear.",
            "Corrosion Protection: Forms a moisture barrier over internal components during humid or rainy weather.",
          ],
        },
        {
          heading: "2. Why JASO MA2 Certification Matters",
          paragraphs: [
            "JASO MA2 is the Japanese Automotive Standards Organization specification for high-friction wet clutch engagement. It guarantees zero clutch slippage during rapid acceleration while protecting transmission gear teeth.",
          ],
        },
        {
          heading: "3. Advanced Lubrication Technology by MAHALAXMI ENTERPRISES",
          paragraphs: [
            "HP RACER 4T oils are blended with premium Group II base stocks and synthetic additives. They deliver exceptional thermal stability, preventing oil breakdown when idling in dense Indian city traffic.",
          ],
        },
      ],
      conclusion:
        "Keep your motorcycle engine smooth, responsive, and long-lasting with HP RACER 4T series motorcycle oils supplied by Mahalaxmi Enterprises.",
      recommendedProducts: [
        "HP RACER 4T 20W-40",
        "HP RACER 4T SYNTH 10W-30",
        "HP RACER SKUTO 10W-30",
      ],
    },
    recommendedProducts: [],
    isPublished: true,
    createdAt: "2026-08-26T06:15:04.336Z",
    updatedAt: "2026-08-26T06:15:04.336Z",
  },
  {
    id: "blog-6",
    title: "Synthetic Engine Oil: Types, Properties, and Uses",
    slug: "synthetic-engine-oil-types-properties-and-uses",
    category: "Automotive",
    publishDate: "February 01, 2026",
    readTime: "7 min read",
    author: "HPCL Lubricants Research Lab",
    excerpt:
      "Explore full synthetic and semi-synthetic basestocks, extreme temperature viscosity stability, wear protection additives, and fuel economy benefits.",
    coverImage: "https://www.hplubricants.in/sites/default/files/Synthetic-Oil-Final-Graphic.jpg",
    content: {
      intro:
        "Synthetic engine oils are chemically engineered from pure base stocks to deliver uniform molecular structure, extreme temperature tolerance, and minimal volatility loss. This guide details synthetic oil categories, superior properties, and key applications.",
      sections: [
        {
          heading: "1. Types of Synthetic Engine Oils",
          paragraphs: ["Synthetic lubricants are tailored for specific performance demands:"],
          bulletPoints: [
            "Full Synthetic Oil: Formulated entirely from Group III/IV synthetic basestocks; delivers ultimate cold-start fluidity, oxidation control, and extended drain intervals.",
            "Synthetic Blend Oil: Combines synthetic and conventional basestocks, providing superior protection over mineral oil at an accessible price point.",
          ],
        },
        {
          heading: "2. Key Superior Properties",
          paragraphs: ["Synthetic oils outperform conventional oils across critical metrics:"],
          bulletPoints: [
            "Viscosity Index Stability: Resists thinning in summer heat and flow resistance during winter starts.",
            "High-Temperature Resistance: Prevents turbocharger coking and thermal breakdown under heavy load.",
            "Active Detergency: Keeps engine interiors free of harmful sludge, varnish, and carbon deposits.",
          ],
        },
        {
          heading: "3. Versatile Applications",
          paragraphs: [
            "Ideal for modern passenger cars, sports motorcycles, commercial fleets, and heavy industrial machinery requiring API SN/SP or CK-4 standards.",
          ],
        },
      ],
      conclusion:
        "Upgrade your vehicle to HP FUTUR-X full synthetic engine oils for maximum horsepower, engine cleanliness, and optimized fuel economy.",
      recommendedProducts: ["HP FUTUR-X 5W-40", "HP FUTUR-X 5W-30", "HP FUTUR-X 0W-20"],
    },
    recommendedProducts: [],
    isPublished: true,
    createdAt: "2026-08-26T06:15:04.336Z",
    updatedAt: "2026-08-26T06:15:04.336Z",
  },
  {
    id: "blog-7",
    title: "The Best Engine Oil for Your Bike: Durability & Performance",
    slug: "the-best-engine-oil-for-your-bike",
    category: "Bike Oils",
    publishDate: "February 08, 2026",
    readTime: "6 min read",
    author: "Mahalaxmi Two-Wheeler Lube Advisory",
    excerpt:
      "Discover why HP RACER 4T series is the top choice for two-wheelers, delivering wet clutch friction control, reduced oil consumption, and lower maintenance costs.",
    coverImage:
      "https://www.hplubricants.in/sites/default/files/The-best-engine-oil-for-your-bike-thumb.jpg",
    content: {
      intro:
        "Choosing the right engine oil for your bike is crucial for maintaining performance, efficiency, and engine longevity. MAHALAXMI ENTERPRISES' Two Wheeler Engine Oil range is engineered to meet the stringent demands of modern motorcycles, commuters, and scooters across Indian road conditions.",
      sections: [
        {
          heading: "1. Enhanced Engine Durability",
          paragraphs: [
            "Manufactured from premium Group II base stocks and state-of-the-art additive technology meeting API SJ/SL and JASO MA2 specifications. Delivers 3-in-1 protection for the engine, wet clutch, and gearbox.",
          ],
        },
        {
          heading: "2. Reduced Oil Consumption",
          paragraphs: [
            "Creates a dense microscopic seal between piston rings and cylinder walls. Minimizes oil evaporation and oil burning in combustion chambers, reducing frequent oil top-ups.",
          ],
        },
        {
          heading: "3. Lower Maintenance & Extended Drain Life",
          paragraphs: [
            "Protects gears and clutch plates against high-stress friction and thermal degradation, cutting repair frequency and maintenance expenditure.",
          ],
        },
        {
          heading: "4. High Fuel Efficiency",
          paragraphs: [
            "Reduces internal engine drag and fluid resistance, ensuring maximum power transfer to the rear wheel and economical mileage.",
          ],
        },
      ],
      conclusion:
        "Experience an unparalleled biking experience with HP RACER 4T motorcycle lubricants from Mahalaxmi Enterprises.",
      recommendedProducts: ["HP RACER 4T 20W-40", "HP RACER 4T SYNTH 10W-30", "HP RACER 4T 10W-30"],
    },
    recommendedProducts: [],
    isPublished: true,
    createdAt: "2026-08-26T06:15:04.336Z",
    updatedAt: "2026-08-26T06:15:04.336Z",
  },
];

let mockOffices: any[] = [];

let mockEnquiries: any[] = [
  {
    id: "enq-1",
    name: "Vikram Malhotra",
    email: "vikram@malhotralogistics.in",
    phone: "+91 98111 22334",
    company: "Malhotra Heavy Transport Corp",
    interestedIn: "Bulk Commercial Lubricants",
    product: "HP Milcy Turbo 15W-40 (210L Barrels)",
    budget: "50+ Barrels Monthly",
    message: "We operate a fleet of 80 BharatBenz trailers and need monthly bulk supply contract.",
    status: "Pending",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "enq-2",
    name: "Suresh Gupta",
    email: "suresh.g@guptamachinery.com",
    phone: "+91 99222 33445",
    company: "Gupta Precision Tools",
    interestedIn: "Industrial Hydraulic Oils",
    product: "ENKLO 68 PREMIUM",
    budget: "10 Barrels",
    message: "Require TDS certificate and bulk quote for hydraulic plant maintenance.",
    status: "Contacted",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const mockPrisma: any = {
  globalConfig: {
    findFirst: async () => ({
      id: "global",
      siteTitle: "Mahalaxmi Enterprises | HP Lubricants Distributor",
      siteDescription:
        "Authorized Industrial Lube Distributor (ILD) for Hindustan Petroleum Corporation Limited (HPCL).",
      logo: "https://res.cloudinary.com/dpa93copz/image/upload/v1787728459/mahalaxmi/branding/aet8vc9jfakxqvmybcib.png",
      phone: "+91 88007 78032",
      email: "info@hplubricantscfa.com",
      address: "Baghpat Region & Surrounding Industrial Belts, Uttar Pradesh, India",
      socialLinks: {
        facebook: "https://www.facebook.com/hindustanpetroleumcorporateltd",
        youtube: "https://www.youtube.com/channel/UCJzt53YmvAJQjT-rLSTqNjg",
        instagram: "https://www.instagram.com/hplubricants_hpcl/",
        linkedin: "https://www.linkedin.com/company/hpcl",
        hpclBadge:
          "https://res.cloudinary.com/dpa93copz/image/upload/v1787731176/mahalaxmi/footer/aygvpp2xhjpyk555i2x4.jpg",
        indiaGovBadge:
          "https://res.cloudinary.com/dpa93copz/image/upload/v1787731177/mahalaxmi/footer/rnrmsenowtlzykcxuprr.jpg",
        globalCompactBadge:
          "https://res.cloudinary.com/dpa93copz/image/upload/v1787731177/mahalaxmi/footer/rnrmsenowtlzykcxuprr.jpg",
        copyrightText: "© 2026 Mahalaxmi Enterprises. All rights reserved.",
      },
    }),
    findUnique: async () => ({
      id: "global",
      siteTitle: "Mahalaxmi Enterprises | HP Lubricants Distributor",
      siteDescription:
        "Authorized Industrial Lube Distributor (ILD) for Hindustan Petroleum Corporation Limited (HPCL).",
      logo: "https://res.cloudinary.com/dpa93copz/image/upload/v1787728459/mahalaxmi/branding/aet8vc9jfakxqvmybcib.png",
      phone: "+91 88007 78032",
      email: "info@hplubricantscfa.com",
      address: "Baghpat Region & Surrounding Industrial Belts, Uttar Pradesh, India",
      socialLinks: {
        facebook: "https://www.facebook.com/hindustanpetroleumcorporateltd",
        youtube: "https://www.youtube.com/channel/UCJzt53YmvAJQjT-rLSTqNjg",
        instagram: "https://www.instagram.com/hplubricants_hpcl/",
        linkedin: "https://www.linkedin.com/company/hpcl",
        hpclBadge:
          "https://res.cloudinary.com/dpa93copz/image/upload/v1787731176/mahalaxmi/footer/aygvpp2xhjpyk555i2x4.jpg",
        indiaGovBadge:
          "https://res.cloudinary.com/dpa93copz/image/upload/v1787731177/mahalaxmi/footer/rnrmsenowtlzykcxuprr.jpg",
        globalCompactBadge:
          "https://res.cloudinary.com/dpa93copz/image/upload/v1787731177/mahalaxmi/footer/rnrmsenowtlzykcxuprr.jpg",
        copyrightText: "© 2026 Mahalaxmi Enterprises. All rights reserved.",
      },
    }),
    upsert: async ({ create, update }: any) => ({
      id: "global",
      ...(update || create || {}),
    }),
  },
  user: {
    findUnique: async ({ where }: any) => {
      if (where.email) return mockUsers.find((u) => u.email === where.email) || null;
      if (where.id) return mockUsers.find((u) => u.id === where.id) || null;
      return null;
    },
    findMany: async () => mockUsers,
    create: async ({ data }: any) => {
      const user = {
        id: `user-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...data,
      };
      mockUsers.push(user);
      return user;
    },
    update: async ({ where, data }: any) => {
      const idx = mockUsers.findIndex((u) => u.id === where.id || u.email === where.email);
      if (idx !== -1) {
        mockUsers[idx] = { ...mockUsers[idx], ...data, updatedAt: new Date() };
        return mockUsers[idx];
      }
      return null;
    },
    upsert: async ({ where, create, update }: any) => {
      const existing = mockUsers.find(
        (u) => (where.id && u.id === where.id) || (where.email && u.email === where.email),
      );
      if (existing) {
        const idx = mockUsers.indexOf(existing);
        mockUsers[idx] = { ...mockUsers[idx], ...update, updatedAt: new Date() };
        return mockUsers[idx];
      }
      const user = {
        id: `user-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...create,
      };
      mockUsers.push(user);
      return user;
    },
    count: async () => mockUsers.length,
  },

  globalSetting: {
    findUnique: async ({ where }: any) => {
      if (mockSettings[where.key]) {
        return { key: where.key, value: mockSettings[where.key] };
      }
      return null;
    },
    findMany: async () => {
      return Object.entries(mockSettings).map(([key, value]) => ({ key, value }));
    },
    upsert: async ({ where, create, update }: any) => {
      const val = update?.value || create?.value;
      mockSettings[where.key] = val;
      return { key: where.key, value: val };
    },
  },

  navigationLink: {
    findMany: async () => mockNavigation,
    findFirst: async ({ where }: any) => {
      return (
        mockNavigation.find(
          (n) =>
            (!where.location || n.location === where.location) &&
            (!where.label || n.label === where.label),
        ) || null
      );
    },
    create: async ({ data }: any) => {
      const item = { id: `nav-${Date.now()}`, ...data };
      mockNavigation.push(item);
      return item;
    },
  },

  page: {
    findUnique: async ({ where, include }: any) => {
      const page = mockPages.find(
        (p) => (where.id && p.id === where.id) || (where.slug && p.slug === where.slug),
      );
      if (!page) return null;
      if (include?.sections) return page;
      return page;
    },
    findMany: async ({ include }: any) => mockPages,
    upsert: async ({ where, create, update }: any) => {
      const existing = mockPages.find(
        (p) => (where.id && p.id === where.id) || (where.slug && p.slug === where.slug),
      );
      if (existing) {
        const idx = mockPages.indexOf(existing);
        mockPages[idx] = { ...mockPages[idx], ...update, updatedAt: new Date() };
        return mockPages[idx];
      }
      const page = {
        id: `page-${Date.now()}`,
        sections: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        ...create,
      };
      mockPages.push(page);
      return page;
    },
    count: async () => mockPages.length,
  },

  section: {
    findFirst: async ({ where }: any) => {
      const page = mockPages.find((p) => p.id === where.pageId);
      if (!page) return null;
      return page.sections.find((s: any) => s.type === where.type) || null;
    },
    findMany: async ({ where }: any) => {
      if (where?.pageId) {
        const page = mockPages.find((p) => p.id === where.pageId);
        return page ? page.sections : [];
      }
      return [];
    },
    create: async ({ data }: any) => {
      const page = mockPages.find((p) => p.id === data.pageId);
      const section = {
        id: `sec-${Date.now()}`,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      if (page) {
        page.sections.push(section);
      }
      return section;
    },
    update: async ({ where, data }: any) => {
      for (const page of mockPages) {
        const idx = page.sections.findIndex((s: any) => s.id === where.id);
        if (idx !== -1) {
          page.sections[idx] = { ...page.sections[idx], ...data, updatedAt: new Date() };
          return page.sections[idx];
        }
      }
      return null;
    },
  },

  productCategory: {
    findMany: async ({ include, orderBy }: any) => {
      return mockCategories.map((c) => {
        const productCount = mockProducts.filter((p) => p.categorySlug === c.slug).length;
        return {
          ...c,
          _count: { products: productCount },
        };
      });
    },
    findUnique: async ({ where }: any) => {
      const cat = mockCategories.find(
        (c) => (where.id && c.id === where.id) || (where.slug && c.slug === where.slug),
      );
      if (!cat) return null;
      const productCount = mockProducts.filter((p) => p.categorySlug === cat.slug).length;
      return { ...cat, _count: { products: productCount } };
    },
    upsert: async ({ where, create, update }: any) => {
      const existing = mockCategories.find(
        (c) => (where.id && c.id === where.id) || (where.slug && c.slug === where.slug),
      );
      if (existing) {
        const idx = mockCategories.indexOf(existing);
        mockCategories[idx] = { ...mockCategories[idx], ...update, updatedAt: new Date() };
        return mockCategories[idx];
      }
      const cat = {
        id: `cat-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...create,
      };
      mockCategories.push(cat);
      return cat;
    },
    create: async ({ data }: any) => {
      const cat = {
        id: `cat-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...data,
      };
      mockCategories.push(cat);
      return cat;
    },
    update: async ({ where, data }: any) => {
      const idx = mockCategories.findIndex((c) => c.id === where.id || c.slug === where.slug);
      if (idx !== -1) {
        mockCategories[idx] = { ...mockCategories[idx], ...data, updatedAt: new Date() };
        return mockCategories[idx];
      }
      return null;
    },
    delete: async ({ where }: any) => {
      mockCategories = mockCategories.filter((c) => c.id !== where.id && c.slug !== where.slug);
      return { success: true };
    },
    count: async () => mockCategories.length,
  },

  product: {
    findMany: async ({ where, orderBy, take, skip }: any) => {
      let result = [...mockProducts];
      if (where?.categorySlug && where.categorySlug !== "all") {
        result = result.filter((p) => p.categorySlug === where.categorySlug);
      }
      if (where?.isFeatured !== undefined) {
        result = result.filter((p) => p.isFeatured === where.isFeatured);
      }
      return result;
    },
    findUnique: async ({ where }: any) => {
      return (
        mockProducts.find(
          (p) => (where.id && p.id === where.id) || (where.slug && p.slug === where.slug),
        ) || null
      );
    },
    upsert: async ({ where, create, update }: any) => {
      const existing = mockProducts.find(
        (p) => (where.id && p.id === where.id) || (where.slug && p.slug === where.slug),
      );
      if (existing) {
        const idx = mockProducts.indexOf(existing);
        mockProducts[idx] = { ...mockProducts[idx], ...update, updatedAt: new Date() };
        return mockProducts[idx];
      }
      const prod = {
        id: `prod-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...create,
      };
      mockProducts.push(prod);
      return prod;
    },
    create: async ({ data }: any) => {
      const prod = {
        id: `prod-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...data,
      };
      mockProducts.push(prod);
      return prod;
    },
    update: async ({ where, data }: any) => {
      const idx = mockProducts.findIndex((p) => p.id === where.id || p.slug === where.slug);
      if (idx !== -1) {
        mockProducts[idx] = { ...mockProducts[idx], ...data, updatedAt: new Date() };
        return mockProducts[idx];
      }
      return null;
    },
    delete: async ({ where }: any) => {
      mockProducts = mockProducts.filter((p) => p.id !== where.id && p.slug !== where.slug);
      return { success: true };
    },
    count: async () => mockProducts.length,
  },

  blogPost: {
    findMany: async ({ orderBy, where }: any) => {
      let result = [...mockBlogs];
      if (where?.isPublished !== undefined) {
        result = result.filter((b) => b.isPublished === where.isPublished);
      }
      return result;
    },
    findUnique: async ({ where }: any) => {
      return (
        mockBlogs.find(
          (b) => (where.id && b.id === where.id) || (where.slug && b.slug === where.slug),
        ) || null
      );
    },
    upsert: async ({ where, create, update }: any) => {
      const existing = mockBlogs.find(
        (b) => (where.id && b.id === where.id) || (where.slug && b.slug === where.slug),
      );
      if (existing) {
        const idx = mockBlogs.indexOf(existing);
        mockBlogs[idx] = { ...mockBlogs[idx], ...update, updatedAt: new Date() };
        return mockBlogs[idx];
      }
      const blog = {
        id: `blog-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...create,
      };
      mockBlogs.push(blog);
      return blog;
    },
    create: async ({ data }: any) => {
      const blog = {
        id: `blog-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...data,
      };
      mockBlogs.push(blog);
      return blog;
    },
    update: async ({ where, data }: any) => {
      const idx = mockBlogs.findIndex((b) => b.id === where.id || b.slug === where.slug);
      if (idx !== -1) {
        mockBlogs[idx] = { ...mockBlogs[idx], ...data, updatedAt: new Date() };
        return mockBlogs[idx];
      }
      return null;
    },
    delete: async ({ where }: any) => {
      mockBlogs = mockBlogs.filter((b) => b.id !== where.id && b.slug !== where.slug);
      return { success: true };
    },
    count: async () => mockBlogs.length,
  },

  officeLocation: {
    findMany: async () => mockOffices,
    findFirst: async ({ where }: any) => {
      return (
        mockOffices.find(
          (o) => (where.name && o.name === where.name) || (where.id && o.id === where.id),
        ) || null
      );
    },
    create: async ({ data }: any) => {
      const off = {
        id: `off-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...data,
      };
      mockOffices.push(off);
      return off;
    },
    update: async ({ where, data }: any) => {
      const idx = mockOffices.findIndex((o) => o.id === where.id || o.name === where.name);
      if (idx !== -1) {
        mockOffices[idx] = { ...mockOffices[idx], ...data, updatedAt: new Date() };
        return mockOffices[idx];
      }
      return null;
    },
    delete: async ({ where }: any) => {
      mockOffices = mockOffices.filter((o) => o.id !== where.id);
      return { success: true };
    },
    count: async () => mockOffices.length,
  },

  enquiry: {
    findMany: async ({ orderBy }: any) => mockEnquiries,
    create: async ({ data }: any) => {
      const enq = {
        id: `enq-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...data,
      };
      mockEnquiries.unshift(enq);
      return enq;
    },
    count: async () => mockEnquiries.length,
  },

  $disconnect: async () => {},
};
