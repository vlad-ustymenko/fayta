'use strict';

/**
 * news-card service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::news-card.news-card');
