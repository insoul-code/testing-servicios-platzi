import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { Auth } from '../models/auth.model';
import { environment } from './../../environments/environment';

describe('AuthService', () => {
  let authtService: AuthService;
  let httpController: HttpTestingController;
  let tokenService: TokenService;

  beforeEach(()=>{
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
        AuthService,
        TokenService,
      ]
    });

    authtService = TestBed.inject(AuthService);
    httpController = TestBed.inject(HttpTestingController);
    tokenService = TestBed.inject(TokenService);
  });

  afterEach(()=>{
    httpController.verify();
  });

  it('should be created products',()=>{
    expect(authtService).toBeTruthy();
  });

  describe('Test for login', () =>{
    it('Should return a token', (dondeFn) => {
    //Arrange
    const mockData: Auth = {
      access_token: '1234566'
    };
    const email = 'nico@gmail.com';
    const password = '1212';
    //Act
    authtService.login(email,password)
    .subscribe((data)=>{
      //Assert
      expect(data).toEqual(mockData);
      dondeFn();
    });
    //http config
    const url = `${environment.API_URL}/api/auth/login`
    const req = httpController.expectOne(url)
    req.flush(mockData);
    });

    it('Should call savetoken', (dondeFn) => {
    //Arrange
    const mockData: Auth = {
      access_token: '1234566'
    };
    const email = 'nico@gmail.com';
    const password = '1212';
    spyOn(tokenService, 'saveToken').and.callThrough();
    //Act
    authtService.login(email,password)
    .subscribe((data)=>{
      //Assert
      expect(data).toEqual(mockData);
      expect(tokenService.saveToken).toHaveBeenCalledTimes(1);
      expect(tokenService.saveToken).toHaveBeenCalledWith('1234566');
      dondeFn();
    });
    //http config
    const url = `${environment.API_URL}/api/auth/login`
    const req = httpController.expectOne(url)
    req.flush(mockData);
    });
  })
});
