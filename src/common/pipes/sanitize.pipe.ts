import { PipeTransform, Injectable } from '@nestjs/common';
const sanitizeHtml = require('sanitize-html');

@Injectable()
export class SanitizePipe implements PipeTransform {
  transform(value: any) {
    console.log("I m hereeee");
    console.log("Value to sanitize", value);
    
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
    
    console.log("Sanitized value", value);
    return value;
  }
}