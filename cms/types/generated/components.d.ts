import type { Schema, Struct } from '@strapi/strapi';

export interface BlocksAdvantages extends Struct.ComponentSchema {
  collectionName: 'components_blocks_advantages';
  info: {
    displayName: 'Advantages';
  };
  attributes: {
    advantagesCards: Schema.Attribute.Component<
      'components.advanages-card',
      true
    >;
    blockTitle: Schema.Attribute.Component<'components.block-title', false>;
    moreButton: Schema.Attribute.Component<'components.button', false>;
  };
}

export interface BlocksApartment extends Struct.ComponentSchema {
  collectionName: 'components_blocks_apartments';
  info: {
    displayName: 'Apartment';
  };
  attributes: {
    apartment_cards: Schema.Attribute.Relation<
      'oneToMany',
      'api::aparmnet-card.aparmnet-card'
    >;
    apartmentCategories: Schema.Attribute.Component<
      'components.apartment-catrgories',
      true
    > &
      Schema.Attribute.SetMinMax<
        {
          max: 5;
        },
        number
      >;
    backgroundImage: Schema.Attribute.Media<'images'>;
    blockTitle: Schema.Attribute.Component<'components.block-title', false>;
    button: Schema.Attribute.Component<'components.button', false>;
    title: Schema.Attribute.RichText;
  };
}

export interface BlocksBuilding extends Struct.ComponentSchema {
  collectionName: 'components_blocks_buildings';
  info: {
    displayName: 'Building';
  };
  attributes: {
    blockTitle: Schema.Attribute.Component<'components.block-title', false>;
    building_cards: Schema.Attribute.Relation<
      'oneToMany',
      'api::building-card.building-card'
    >;
    button: Schema.Attribute.Component<'components.button', false>;
    title: Schema.Attribute.RichText;
  };
}

export interface BlocksConcept extends Struct.ComponentSchema {
  collectionName: 'components_blocks_concepts';
  info: {
    displayName: 'Concept';
  };
  attributes: {
    blockID: Schema.Attribute.String & Schema.Attribute.Required;
    blockTitle: Schema.Attribute.Component<'components.block-title', false> &
      Schema.Attribute.Required;
    button: Schema.Attribute.Component<'components.button', false>;
    description: Schema.Attribute.RichText & Schema.Attribute.Required;
    maskedImage: Schema.Attribute.Component<'components.masked-image', false> &
      Schema.Attribute.Required;
    stats: Schema.Attribute.Component<'components.stats', true> &
      Schema.Attribute.Required;
    title: Schema.Attribute.RichText & Schema.Attribute.Required;
  };
}

export interface BlocksContacts extends Struct.ComponentSchema {
  collectionName: 'components_blocks_contacts';
  info: {
    displayName: 'Contacts';
  };
  attributes: {
    blockTitle: Schema.Attribute.Component<'components.block-title', false>;
    button: Schema.Attribute.String;
    confidentialText: Schema.Attribute.RichText;
    contactsInfo: Schema.Attribute.Component<'components.contacts-info', true>;
    form: Schema.Attribute.Component<'components.form-input', true>;
    googleMap: Schema.Attribute.String;
    rightBlockTitle: Schema.Attribute.String;
    socialIcons: Schema.Attribute.Component<'components.social-icon', true>;
    socialText: Schema.Attribute.String;
  };
}

export interface BlocksDeveloper extends Struct.ComponentSchema {
  collectionName: 'components_blocks_developers';
  info: {
    displayName: 'Developer';
  };
  attributes: {
    blockTitle: Schema.Attribute.Component<'components.block-title', false>;
    description: Schema.Attribute.RichText;
    logo: Schema.Attribute.Media<'images'>;
    stats: Schema.Attribute.Component<'components.stats', true>;
    title: Schema.Attribute.RichText;
  };
}

export interface BlocksDocumentation extends Struct.ComponentSchema {
  collectionName: 'components_blocks_documentations';
  info: {
    displayName: 'Documentation';
  };
  attributes: {
    blockTitle: Schema.Attribute.Component<'components.block-title', false>;
    doc: Schema.Attribute.Component<'components.link', true>;
    title: Schema.Attribute.RichText;
  };
}

export interface BlocksFeedback extends Struct.ComponentSchema {
  collectionName: 'components_blocks_feedbacks';
  info: {
    displayName: 'Feedback';
  };
  attributes: {
    button: Schema.Attribute.String & Schema.Attribute.Required;
    confidentialText: Schema.Attribute.RichText & Schema.Attribute.Required;
    form: Schema.Attribute.Component<'components.form-input', true> &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 2;
        },
        number
      >;
    leftBlockName: Schema.Attribute.String & Schema.Attribute.Required;
    leftBlockText: Schema.Attribute.String & Schema.Attribute.Required;
    leftBlockTitle: Schema.Attribute.RichText & Schema.Attribute.Required;
    phone: Schema.Attribute.String & Schema.Attribute.Required;
    phoneTitle: Schema.Attribute.String & Schema.Attribute.Required;
    rightBlockName: Schema.Attribute.String & Schema.Attribute.Required;
    rightBlockTitle: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface BlocksFooter extends Struct.ComponentSchema {
  collectionName: 'components_blocks_footers';
  info: {
    displayName: 'Footer';
  };
  attributes: {
    copyright: Schema.Attribute.String & Schema.Attribute.Required;
    icon: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    leftBlock: Schema.Attribute.Component<'components.menu-link', true>;
    policy: Schema.Attribute.Component<'components.link', false>;
    rightBlock: Schema.Attribute.Component<'components.menu-link', true>;
    socialIcons: Schema.Attribute.Component<'components.social-icon', true>;
    socialText: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface BlocksGalery extends Struct.ComponentSchema {
  collectionName: 'components_blocks_galeries';
  info: {
    displayName: 'Galery';
  };
  attributes: {
    images: Schema.Attribute.Media<'images', true> & Schema.Attribute.Required;
    title: Schema.Attribute.RichText & Schema.Attribute.Required;
  };
}

export interface BlocksGenplan extends Struct.ComponentSchema {
  collectionName: 'components_blocks_genplans';
  info: {
    displayName: 'Genplan';
  };
  attributes: {
    genplanMarkers: Schema.Attribute.Component<
      'components.genplan-markers',
      true
    >;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
  };
}

export interface BlocksHeader extends Struct.ComponentSchema {
  collectionName: 'components_blocks_headers';
  info: {
    displayName: 'Header';
  };
  attributes: {
    button: Schema.Attribute.String & Schema.Attribute.Required;
    logo: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    menuLinks: Schema.Attribute.Component<'components.menu-link', true>;
  };
}

export interface BlocksHomeMainScreen extends Struct.ComponentSchema {
  collectionName: 'components_blocks_home_main_screens';
  info: {
    displayName: 'HomeMainScreen';
  };
  attributes: {
    image: Schema.Attribute.Media<'images' | 'videos'> &
      Schema.Attribute.Required;
    socialIcons: Schema.Attribute.Component<'components.social-icon', true>;
    subTitle: Schema.Attribute.String & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface BlocksInfrastructure extends Struct.ComponentSchema {
  collectionName: 'components_blocks_infrastructures';
  info: {
    displayName: 'Infrastructure';
  };
  attributes: {
    blockTitle: Schema.Attribute.Component<'components.block-title', false> &
      Schema.Attribute.Required;
    homePlace: Schema.Attribute.Component<'components.home-place', false>;
    mapCategoris: Schema.Attribute.Component<'components.categories', true>;
    title: Schema.Attribute.RichText & Schema.Attribute.Required;
  };
}

export interface BlocksInvestment extends Struct.ComponentSchema {
  collectionName: 'components_blocks_investments';
  info: {
    displayName: 'Investment';
  };
  attributes: {
    blockTitle: Schema.Attribute.Component<'components.block-title', false>;
    description: Schema.Attribute.RichText & Schema.Attribute.Required;
    investmentList: Schema.Attribute.Component<
      'components.investment-list',
      true
    > &
      Schema.Attribute.Required;
    title: Schema.Attribute.RichText & Schema.Attribute.Required;
  };
}

export interface BlocksMenu extends Struct.ComponentSchema {
  collectionName: 'components_blocks_menus';
  info: {
    displayName: 'Menu';
  };
  attributes: {
    menuLinks: Schema.Attribute.Component<'components.menu-link', true>;
  };
}

export interface BlocksNews extends Struct.ComponentSchema {
  collectionName: 'components_blocks_news';
  info: {
    displayName: 'News';
  };
  attributes: {
    blockTitle: Schema.Attribute.Component<'components.block-title', false>;
    button: Schema.Attribute.Component<'components.button', false>;
    news_cards: Schema.Attribute.Relation<
      'oneToMany',
      'api::news-card.news-card'
    >;
    newsCategories: Schema.Attribute.Component<
      'components.news-categorie',
      true
    >;
    title: Schema.Attribute.RichText;
  };
}

export interface BlocksSidebar extends Struct.ComponentSchema {
  collectionName: 'components_blocks_sidebars';
  info: {
    displayName: 'Sidebar';
  };
  attributes: {
    button: Schema.Attribute.String & Schema.Attribute.Required;
    confidentialText: Schema.Attribute.RichText & Schema.Attribute.Required;
    form: Schema.Attribute.Component<'components.form-input', true> &
      Schema.Attribute.SetMinMax<
        {
          max: 2;
        },
        number
      >;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface BlocksTermsOfPurchase extends Struct.ComponentSchema {
  collectionName: 'components_blocks_terms_of_purchases';
  info: {
    displayName: 'TermsOfPurchase';
  };
  attributes: {
    blockTitle: Schema.Attribute.Component<'components.block-title', false>;
    cards: Schema.Attribute.Component<'components.terms-of-purchase', true>;
    title: Schema.Attribute.RichText;
  };
}

export interface ComponentsAboutCharacter extends Struct.ComponentSchema {
  collectionName: 'components_components_about_characters';
  info: {
    displayName: 'aboutCharacter';
  };
  attributes: {
    icon: Schema.Attribute.Media<'images'>;
    text: Schema.Attribute.Text;
  };
}

export interface ComponentsAboutImages extends Struct.ComponentSchema {
  collectionName: 'components_components_about_images';
  info: {
    displayName: 'aboutImages';
  };
  attributes: {
    description: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String;
  };
}

export interface ComponentsAdvanagesCard extends Struct.ComponentSchema {
  collectionName: 'components_components_advanages_cards';
  info: {
    displayName: 'advanagesCard';
  };
  attributes: {
    description: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String;
  };
}

export interface ComponentsApartmentCatrgories extends Struct.ComponentSchema {
  collectionName: 'components_components_apartment_catrgories';
  info: {
    displayName: 'apartmentCatrgories';
  };
  attributes: {
    slug: Schema.Attribute.Enumeration<
      ['one-room', 'two-room', 'three-room', 'four-room', 'five-room']
    >;
    title: Schema.Attribute.String;
  };
}

export interface ComponentsApartmentCharacter extends Struct.ComponentSchema {
  collectionName: 'components_components_apartment_characters';
  info: {
    displayName: 'apartmentCharacter';
  };
  attributes: {
    characterText: Schema.Attribute.String;
    characterTitle: Schema.Attribute.String;
  };
}

export interface ComponentsBlockTitle extends Struct.ComponentSchema {
  collectionName: 'components_components_block_titles';
  info: {
    displayName: 'blockTitle';
  };
  attributes: {
    image: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ComponentsButton extends Struct.ComponentSchema {
  collectionName: 'components_components_buttons';
  info: {
    displayName: 'button';
  };
  attributes: {
    href: Schema.Attribute.String;
    icon: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ComponentsCategories extends Struct.ComponentSchema {
  collectionName: 'components_components_categories';
  info: {
    displayName: 'mapCategories';
  };
  attributes: {
    name: Schema.Attribute.String;
    places: Schema.Attribute.Component<'components.places', true>;
  };
}

export interface ComponentsContactsInfo extends Struct.ComponentSchema {
  collectionName: 'components_components_contacts_infos';
  info: {
    displayName: 'contactsInfo';
  };
  attributes: {
    text: Schema.Attribute.String;
    title: Schema.Attribute.String;
    type: Schema.Attribute.Enumeration<['phone', 'email', 'address']>;
  };
}

export interface ComponentsFaqItem extends Struct.ComponentSchema {
  collectionName: 'components_components_faq_items';
  info: {
    displayName: 'faqItem';
  };
  attributes: {
    text: Schema.Attribute.Text;
    title: Schema.Attribute.Text;
  };
}

export interface ComponentsFormInput extends Struct.ComponentSchema {
  collectionName: 'components_components_form_inputs';
  info: {
    displayName: 'formInput';
  };
  attributes: {
    emptyDataErr: Schema.Attribute.String & Schema.Attribute.Required;
    placeholder: Schema.Attribute.String & Schema.Attribute.Required;
    type: Schema.Attribute.Enumeration<['phone', 'name']> &
      Schema.Attribute.Required;
    unvalidDataErr: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ComponentsGenplanMarkers extends Struct.ComponentSchema {
  collectionName: 'components_components_genplan_markers';
  info: {
    displayName: 'genplanMarkers';
  };
  attributes: {
    title: Schema.Attribute.String;
    x: Schema.Attribute.Decimal;
    y: Schema.Attribute.Decimal;
  };
}

export interface ComponentsHomePlace extends Struct.ComponentSchema {
  collectionName: 'components_components_home_places';
  info: {
    displayName: 'homePlace';
  };
  attributes: {
    lat: Schema.Attribute.Decimal;
    lng: Schema.Attribute.Decimal;
    name: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ComponentsImageSlider extends Struct.ComponentSchema {
  collectionName: 'components_components_image_sliders';
  info: {
    displayName: 'imageSlider';
  };
  attributes: {
    description: Schema.Attribute.Text;
    images: Schema.Attribute.Media<'images', true> & Schema.Attribute.Required;
    title: Schema.Attribute.Text;
  };
}

export interface ComponentsInvestmentList extends Struct.ComponentSchema {
  collectionName: 'components_components_investment_lists';
  info: {
    displayName: 'investmentList';
  };
  attributes: {
    leftBlockIcon: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    leftBlockTitle: Schema.Attribute.String & Schema.Attribute.Required;
    rightBlockDescription: Schema.Attribute.Text & Schema.Attribute.Required;
    rightBlockTitle: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ComponentsLink extends Struct.ComponentSchema {
  collectionName: 'components_components_links';
  info: {
    displayName: 'link';
  };
  attributes: {
    link: Schema.Attribute.String & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ComponentsMaskedImage extends Struct.ComponentSchema {
  collectionName: 'components_components_masked_images';
  info: {
    displayName: 'maskedImage';
  };
  attributes: {
    backgroundImage: Schema.Attribute.Media<'images' | 'videos'>;
    maskImage: Schema.Attribute.Media<'images'>;
  };
}

export interface ComponentsMenuLink extends Struct.ComponentSchema {
  collectionName: 'components_components_menu_links';
  info: {
    displayName: 'menuLink';
  };
  attributes: {
    blockID: Schema.Attribute.Enumeration<
      [
        'concept',
        'apartments',
        'news',
        'contacts',
        'termsOfPurchese',
        'building',
        'genplan',
      ]
    >;
    title: Schema.Attribute.String;
  };
}

export interface ComponentsNewsCategorie extends Struct.ComponentSchema {
  collectionName: 'components_components_news_categories';
  info: {
    displayName: 'newsCategorie';
  };
  attributes: {
    slug: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface ComponentsPlaces extends Struct.ComponentSchema {
  collectionName: 'components_components_places';
  info: {
    displayName: 'places';
  };
  attributes: {
    lat: Schema.Attribute.Decimal;
    lng: Schema.Attribute.Decimal;
    name: Schema.Attribute.String;
    time: Schema.Attribute.String;
  };
}

export interface ComponentsSocialIcon extends Struct.ComponentSchema {
  collectionName: 'components_components_social_icons';
  info: {
    displayName: 'socialIcon';
  };
  attributes: {
    link: Schema.Attribute.String;
    title: Schema.Attribute.Enumeration<
      ['instagram', 'telegram', 'youtube', 'tiktok', 'linkedin', 'facebook']
    >;
  };
}

export interface ComponentsSocialLinks extends Struct.ComponentSchema {
  collectionName: 'components_components_social_links';
  info: {
    displayName: 'socialLinks';
  };
  attributes: {
    fbLink: Schema.Attribute.String & Schema.Attribute.Required;
    instaLink: Schema.Attribute.String & Schema.Attribute.Required;
    youtubeLink: Schema.Attribute.String;
  };
}

export interface ComponentsStats extends Struct.ComponentSchema {
  collectionName: 'components_components_stats';
  info: {
    displayName: 'stats';
  };
  attributes: {
    bigText: Schema.Attribute.String & Schema.Attribute.Required;
    smallText: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ComponentsTermsOfPurchase extends Struct.ComponentSchema {
  collectionName: 'components_components_terms_of_purchases';
  info: {
    displayName: 'termsOfPurchase';
  };
  attributes: {
    button: Schema.Attribute.Component<'components.button', false>;
    description: Schema.Attribute.Text;
    terms: Schema.Attribute.RichText;
    title: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'blocks.advantages': BlocksAdvantages;
      'blocks.apartment': BlocksApartment;
      'blocks.building': BlocksBuilding;
      'blocks.concept': BlocksConcept;
      'blocks.contacts': BlocksContacts;
      'blocks.developer': BlocksDeveloper;
      'blocks.documentation': BlocksDocumentation;
      'blocks.feedback': BlocksFeedback;
      'blocks.footer': BlocksFooter;
      'blocks.galery': BlocksGalery;
      'blocks.genplan': BlocksGenplan;
      'blocks.header': BlocksHeader;
      'blocks.home-main-screen': BlocksHomeMainScreen;
      'blocks.infrastructure': BlocksInfrastructure;
      'blocks.investment': BlocksInvestment;
      'blocks.menu': BlocksMenu;
      'blocks.news': BlocksNews;
      'blocks.sidebar': BlocksSidebar;
      'blocks.terms-of-purchase': BlocksTermsOfPurchase;
      'components.about-character': ComponentsAboutCharacter;
      'components.about-images': ComponentsAboutImages;
      'components.advanages-card': ComponentsAdvanagesCard;
      'components.apartment-catrgories': ComponentsApartmentCatrgories;
      'components.apartment-character': ComponentsApartmentCharacter;
      'components.block-title': ComponentsBlockTitle;
      'components.button': ComponentsButton;
      'components.categories': ComponentsCategories;
      'components.contacts-info': ComponentsContactsInfo;
      'components.faq-item': ComponentsFaqItem;
      'components.form-input': ComponentsFormInput;
      'components.genplan-markers': ComponentsGenplanMarkers;
      'components.home-place': ComponentsHomePlace;
      'components.image-slider': ComponentsImageSlider;
      'components.investment-list': ComponentsInvestmentList;
      'components.link': ComponentsLink;
      'components.masked-image': ComponentsMaskedImage;
      'components.menu-link': ComponentsMenuLink;
      'components.news-categorie': ComponentsNewsCategorie;
      'components.places': ComponentsPlaces;
      'components.social-icon': ComponentsSocialIcon;
      'components.social-links': ComponentsSocialLinks;
      'components.stats': ComponentsStats;
      'components.terms-of-purchase': ComponentsTermsOfPurchase;
    }
  }
}
