import type { Schema, Struct } from '@strapi/strapi';

export interface BlocksConcept extends Struct.ComponentSchema {
  collectionName: 'components_blocks_concepts';
  info: {
    displayName: 'Concept';
  };
  attributes: {
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

export interface BlocksHeader extends Struct.ComponentSchema {
  collectionName: 'components_blocks_headers';
  info: {
    displayName: 'Header';
  };
  attributes: {
    button: Schema.Attribute.String & Schema.Attribute.Required;
    logo: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    menuLinks: Schema.Attribute.Component<'components.link', true> &
      Schema.Attribute.Required;
  };
}

export interface BlocksHomeMainScreen extends Struct.ComponentSchema {
  collectionName: 'components_blocks_home_main_screens';
  info: {
    displayName: 'HomeMainScreen';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface BlocksMenu extends Struct.ComponentSchema {
  collectionName: 'components_blocks_menus';
  info: {
    displayName: 'Menu';
  };
  attributes: {
    menuLinks: Schema.Attribute.Component<'components.link', true>;
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

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'blocks.concept': BlocksConcept;
      'blocks.galery': BlocksGalery;
      'blocks.header': BlocksHeader;
      'blocks.home-main-screen': BlocksHomeMainScreen;
      'blocks.menu': BlocksMenu;
      'blocks.sidebar': BlocksSidebar;
      'components.block-title': ComponentsBlockTitle;
      'components.button': ComponentsButton;
      'components.form-input': ComponentsFormInput;
      'components.image-slider': ComponentsImageSlider;
      'components.link': ComponentsLink;
      'components.masked-image': ComponentsMaskedImage;
      'components.stats': ComponentsStats;
    }
  }
}
