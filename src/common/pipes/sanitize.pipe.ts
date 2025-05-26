import { PipeTransform, Injectable } from '@nestjs/common';
const sanitizeHtml = require('sanitize-html');

@Injectable()
export class SanitizePipe implements PipeTransform {
  transform(value: any) {
    
    if (typeof value === 'string') {
      return sanitizeHtml(value, {
        allowedTags: [],
        allowedAttributes: {},
        disallowedTagsMode: 'discard',
        allowedSchemes: [],
        allowedSchemesByTag: {},
        allowedSchemesAppliedToAttributes: []
      });
    }

    if (typeof value === 'object' && value !== null) {
      for (const key in value) {
        if (typeof value[key] === 'string') {
          value[key] = sanitizeHtml(value[key], {
            allowedTags: [],
            allowedAttributes: {},
            disallowedTagsMode: 'discard',
            allowedSchemes: [],
            allowedSchemesByTag: {},
            allowedSchemesAppliedToAttributes: []
          });
        }
      }
    }
    
    return value;
  }
}