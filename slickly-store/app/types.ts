export interface Slide {
    id: string;
    title: string;
    subtitle: string;
    image: string;
    cta?: string;
    ctaLink?: string;
    secondaryCta?: string;
    secondaryCtaLink?: string;
    badge?: string;
    hotspots?: Hotspot[];
}

export interface Hotspot {
    id: string;
    x: number;
    y: number;
    label: string;
    price: string;
    description?: string;
    image?: string;
    link?: string;
    productId?: string;
}

export interface Product {
    id: string;
    name: string;
    description?: string;
    brand?: string;
    price: string | number;
    image?: string;
    variants?: Variant[];
    [key: string]: any;
}

export interface Variant {
    id: string;
    name: string;
    [key: string]: any;
}