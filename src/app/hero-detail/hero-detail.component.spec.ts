import { ComponentFixture, fakeAsync, flush, TestBed, tick, waitForAsync } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { By } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";
import { of } from "rxjs";
import { HeroService } from "../hero.service";
import { HeroDetailComponent } from "./hero-detail.component";



describe('heroDetailComponent', () => {
  let fixture: ComponentFixture<HeroDetailComponent>;
  let mockeActivatedRoute, mockHeroService, mockLocation;

  beforeEach(() => {
    mockeActivatedRoute = {
      snapshot: { paramMap: { get: () => { return '3'; } } }
    }
    mockHeroService = jasmine.createSpyObj(['getHero', 'updateHero']);
    mockLocation = jasmine.createSpyObj(['back']);

    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [HeroDetailComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockeActivatedRoute },
        { provide: HeroService, useValue: mockHeroService },
        { provide: Location, useValue: mockLocation },
      ]
    });
    fixture = TestBed.createComponent(HeroDetailComponent);
    mockHeroService.getHero.and.returnValue(of({id:2, name: 'SuperDude', strength: 110 }));

  });

  it('should render hero name correctly in a h2 tag', () => {
    fixture.detectChanges();
    // expect(fixture.debugElement.query(By.css('h2')).nativeElement.textContent).toContain('SUPERDUDE');
    expect(fixture.nativeElement.querySelector('h2').textContent).toContain('SUPERDUDE');
  });

  // fakeAsync(): used for async code testing (create special zone where we could control the clock), works for promises too
  it('should call updateHero when save is called', fakeAsync(() => {

    mockHeroService.updateHero.and.returnValue(of({}));
    fixture.detectChanges();

    fixture.componentInstance.save();
    tick(250); // fast forward the clock to test async code

    // flush(); ==> basically sais look at the zone and see if there are any tasks are waiting,
              // if there are any, fast forward the clock until those waiting tasks have been executed

    expect(mockHeroService.updateHero).toHaveBeenCalled();
  }));

  // waitForAsync(): used for promise testing
  // it('should call updateHero when save is called', waitForAsync(() => {

  //   mockHeroService.updateHero.and.returnValue(of({}));
  //   fixture.detectChanges();

  //   fixture.componentInstance.save();

  //   // whenStable means it should check for promises waiting before running code
  //   fixture.whenStable().then(() => {
  //     expect(mockHeroService.updateHero).toHaveBeenCalled();
  //   })

  // }));
})

