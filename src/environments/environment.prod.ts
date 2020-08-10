/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
export const environment = {
  production: true,
  apiUrl: 'https://ediscipulado-api.herokuapp.com',

  tokenWhitelistedDomains: [ new RegExp('ediscipulado-api.herokuapp.com') ],
  tokenBlacklistedRoutes: [ new RegExp('\/oauth\/token') ],
};
