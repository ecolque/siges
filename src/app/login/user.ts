import { Injectable } from '@angular/core';

@Injectable()
export class User {
    constructor(
        private username: string,
        private password: string) { }
    }
