## AngularLibraryNodeExpressTypeScriptPostgreSQL_20

**AngularLibraryNodeExpressTypeScriptPostgreSQL_20** is a library management web application developed with Angular 20.1.2. It allows users to authenticate themselves and manage authors, publishers, and books. The application is an administration panel for managing a library's core resources (authors, publishers, and books), with a basic authentication and access protection system. It uses Bootstrap 5, PrimeNG and JWT for authentication. The backend is built with Node, Express, TypeScript and PostgreSQL.

AngularLibraryNodeExpressTypeScriptPostgreSQL_20/  
├───app/  
│   ├───guards/  
│   │   └───auth-guard.ts  
│   ├───library/  
│   │   ├───authors/  
│   │   │   ├───authors.css  
│   │   │   ├───authors.html  
│   │   │   └───authors.ts  
│   │   ├───books/  
│   │   │   ├───books.css  
│   │   │   ├───books.html  
│   │   │   └───books.ts  
│   │   ├───publishing-houses/  
│   │   │   ├───publishing-houses.css  
│   │   │   ├───publishing-houses.html  
│   │   │   └───publishing-houses.ts  
│   │   ├───interfaces/  
│   │   │   └───login.interface.ts  
│   │   ├───library.html  
│   │   ├───library.ts  
│   │   └───library.interface.ts  
│   ├───services/  
│   │   ├───app.ts    
│   │   └───library.ts   
│   ├───shared/  
│   │   ├───navbar/  
│   │   │   ├───navbar.html  
│   │   │   └───navbar.ts  
│   ├───start/  
│   │   ├───login/  
│   │   │   ├───login.css  
│   │   │   ├───login.html  
│   │   │   └───login.ts  
│   │   ├───not-found/  
│   │   │   ├───not-found.css  
│   │   │   ├───not-found.html  
│   │   │   └───not-found.ts  
│   ├───app.html  
│   ├───app.ts  
│   ├───app-config.ts  
│   ├───app.routing.ts  
│   └───app.routes.ts  
├───environments/  
│   ├───environment.ts  
│   └───environment.development.ts   
├───main.ts    
├───angular.json  
├───package.json  
└───tsconfig.json  

![AngularLibraryExpress](img/1.png)
![AngularLibraryExpress](img/2.png)
![AngularLibraryExpress](img/3.png)


## environment

```
export const environment = {
  urlAPI: 'http://localhost:3000/',
};

```

[DeepWiki moraisLuismNet/AngularLibraryNodeExpressTypeScriptPostgreSQL_20](https://deepwiki.com/moraisLuismNet/AngularLibraryNodeExpressTypeScriptPostgreSQL_20)

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

