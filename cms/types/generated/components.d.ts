import type { Schema, Struct } from '@strapi/strapi';

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

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'blocks.header': BlocksHeader;
      'blocks.home-main-screen': BlocksHomeMainScreen;
      'blocks.menu': BlocksMenu;
      'blocks.sidebar': BlocksSidebar;
      'components.form-input': ComponentsFormInput;
      'components.link': ComponentsLink;
    }
  }
}
