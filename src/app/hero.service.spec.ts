import { inject, TestBed } from "@angular/core/testing";
import { HeroService } from "./hero.service";
import { MessageService } from "./message.service";
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';


// integration test
describe('HeroService', () => {
  let mockMessageService;
  let httpTestingController: HttpTestingController;
  let service; HeroService;

  beforeEach(() => {
    mockMessageService = jasmine.createSpyObj(['add']);

    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
        HeroService,
        { provide: MessageService, useValue: mockMessageService }
      ]
    });

    httpTestingController = TestBed.inject(HttpTestingController);

    // Getting a handle to HeroService(but we will use another way):
    // service = TestBed.inject(HeroService);
  });

  describe('getHero', () => {
    it('should call get with the correct URL', inject(
      [HeroService, HttpTestingController],
      (service: HeroService, controller: HttpTestingController) => {
        // call getHero()
        service.getHero(4).subscribe();

        // test that the URL was correct
        const req = controller.expectOne('api/heroes/4');

        req.flush({ id: 4, name: 'SuperDude', strength: 100 });
        expect(req.request.method).toBe('GET');
        controller.verify(); // verifies that only the requests that we only expected fired

      }
    ))
  })

});
