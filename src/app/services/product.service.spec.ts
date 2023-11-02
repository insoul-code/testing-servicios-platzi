import { TestBed } from '@angular/core/testing';

import { ProductsService } from './product.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CreateProductDTO, Product, UpdateProductDTO } from '../models/product.model';
import { generateManyProducts, generateOneProduct } from '../models/product.mock';
import { environment } from './../../environments/environment';
import { HTTP_INTERCEPTORS, HttpStatusCode } from '@angular/common/http';
import { TokenInterceptor } from '../interceptors/token.interceptor';
import { TokenService } from './token.service';

describe('ProductService', ()=>{
  let productService: ProductsService;
  let httpController: HttpTestingController;
  let tokenService: TokenService;

  beforeEach(()=>{
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
        ProductsService,
        TokenService,
        {
          provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true
        }
      ]
    });

    productService = TestBed.inject(ProductsService);
    httpController = TestBed.inject(HttpTestingController);
    tokenService = TestBed.inject(TokenService);
  });

  afterEach(()=>{
    httpController.verify();
  })

  it('should be created products',()=>{
    expect(productService).toBeTruthy();
  });

  describe('Tests for getAllSimple', ()=>{
    it('should return a products list',(dondeFn)=>{
      //Arrange
      const mockData: Product[] = generateManyProducts(3);
      spyOn(tokenService, 'getToken').and.returnValue('123');
      //Act
      productService.getAllSimple()
      .subscribe((data)=>{
        //Assert
        expect(data.length).toEqual(mockData.length);
        expect(data).toEqual(mockData);
        dondeFn();
      });
      //http config
      const url = `${environment.API_URL}/api/products`
      const req = httpController.expectOne(url)
      const headers = req.request.headers;
      expect(headers.get('Authorization')).toEqual(`Bearer 123`)
      req.flush(mockData);
    });
  });

  describe('Tests for getAll', ()=>{
    it('should return a products list',(dondeFn)=>{
      //Arrange
      const mockData: Product[] = generateManyProducts(3);
      //Act
      productService.getAll()
      .subscribe((data)=>{
        //Assert
        expect(data.length).toEqual(mockData.length);
        dondeFn();
      });
      //http config
      const url = `${environment.API_URL}/api/products`
      const req = httpController.expectOne(url)
      req.flush(mockData);
    });

    it('Should return product list with taxes', (dondeFn) =>{
      //Arrange
      const mockData: Product[] = [
        {
          ...generateOneProduct(),
          price: 100, //100 * .19 = 19
        },
        {
          ...generateOneProduct(),
          price: 200, //200 * .19 = 38
        },
        {
          ...generateOneProduct(),
          price: 0, //200 * .19 = 0
        },
        {
          ...generateOneProduct(),
          price: -100, // = -0
        },
      ];
      //Act
       productService.getAll()
       .subscribe((data)=>{
         //Assert
         expect(data.length).toEqual(mockData.length);
         expect(data[0].taxes).toEqual(19);
         expect(data[1].taxes).toEqual(38);
         expect(data[2].taxes).toEqual(0);
         expect(data[3].taxes).toEqual(0);
         dondeFn();
       });
       //http config
       const url = `${environment.API_URL}/api/products`
       const req = httpController.expectOne(url)
       req.flush(mockData);
    });

    it('should send query params with limit 10 and offset 3',(dondeFn)=>{
      //Arrange
      const mockData: Product[] = generateManyProducts(3);
      const limit = 10;
      const offset = 3;
      //Act
      productService.getAll(limit, offset)
      .subscribe((data)=>{
        //Assert
        expect(data.length).toEqual(mockData.length);
        dondeFn();
      });
      //http config
      const url = `${environment.API_URL}/api/products?limit=${limit}&offset=${offset}`
      const req = httpController.expectOne(url)
      req.flush(mockData);
      const params = req.request.params;
      expect(params.get('limit')).toEqual(`${limit}`);
      expect(params.get('offset')).toEqual(`${offset}`);
    });
  });

  describe('Tests for create', ()=>{

    it('should returna new product', (dondeFn)=>{
      //Arrange
      const mockData = generateOneProduct();
      const dto: CreateProductDTO = {
        title: 'new product',
        price: 100,
        images: ['img'],
        description: 'bla bla bla bla',
        categoryId: 12
      }
      //Act
      productService.create({...dto})
      .subscribe(data =>{
        //Assert
        expect(data).toEqual(mockData);
        dondeFn();
      });

       //http config
       const url = `${environment.API_URL}/api/products`
       const req = httpController.expectOne(url)
       req.flush(mockData);
       expect(req.request.body).toEqual(dto);
       expect(req.request.method).toEqual('POST');
    });
  });

  describe('test for update', () => {
    it('should update a product', (doneFn) => {
      // Arrange
      const mockData: Product = generateOneProduct();
      const dto: UpdateProductDTO = {
        title: 'new product',
      }
      const productId = '1';
      // Act
      productService.update(productId, {...dto})
      .subscribe((data) => {
        // Assert
        expect(data).toEqual(mockData);
        doneFn();
      });

      // http config
      const url = `${environment.API_URL}/api/products/${productId}`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('PUT');
      expect(req.request.body).toEqual(dto);
      req.flush(mockData);
    });
  });

  describe('test for delete', () => {
    it('should delete a product', (doneFn) => {
      // Arrange
      const mockData = true;
      const productId = '1';
      // Act
      productService.delete(productId)
      .subscribe((data) => {
        // Assert
        expect(data).toEqual(mockData);
        doneFn();
      });

      // http config
      const url = `${environment.API_URL}/api/products/${productId}`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('DELETE');
      req.flush(mockData);
    });
  });

  describe('test for getOne', () => {
    it('should return a product', (doneFn) => {
      // Arrange
      const mockData: Product = generateOneProduct();
      const productId = '1';
      // Act
      productService.getOne(productId)
      .subscribe((data) => {
        // Assert
        expect(data).toEqual(mockData);
        doneFn();
      });

      // http config
      const url = `${environment.API_URL}/api/products/${productId}`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush(mockData);
    });

    it('should return the right message when status code is 404', (doneFn) => {
      // Arrange
      const productId = '1';
      const msgError = '404 message';
      const mockError = {
        status: HttpStatusCode.NotFound,
        statusText: msgError
      }
      // Act
      productService.getOne(productId)
      .subscribe({
        error: (error) =>{
          //Assert
          expect(error).toEqual('El producto no existe');
          doneFn();
        }
      });

      // http config
      const url = `${environment.API_URL}/api/products/${productId}`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush(msgError, mockError);
    });

    it('should return the right message when status code is 409', (doneFn) => {
      // Arrange
      const productId = '1';
      const msgError = '409 message';
      const mockError = {
        status: HttpStatusCode.Conflict,
        statusText: msgError
      }
      // Act
      productService.getOne(productId)
      .subscribe({
        error: (error) =>{
          //Assert
          expect(error).toEqual('Algo esta fallando en el server');
          doneFn();
        }
      });

      // http config
      const url = `${environment.API_URL}/api/products/${productId}`;
      const req = httpController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush(msgError, mockError);
    });
  });

});
