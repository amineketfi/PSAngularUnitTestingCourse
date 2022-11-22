import { Component, Input, NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { of } from "rxjs";
import { Hero } from "../hero";
import { HeroService } from "../hero.service";
import { HeroesComponent } from "./heroes.component"

// Isolated test:
describe('HeroesComponent', () => {
  let component: HeroesComponent;
  let HEROES;
  let mockHeroService;

  beforeEach(() => {
    HEROES = [
      {id:1, name: 'SpiderDude', strength: 8},
      {id:2, name: 'Wonderful Woman', strength: 24},
      {id:3, name: 'SuperDude', strength: 55},
    ]

    mockHeroService = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero']);

    component = new HeroesComponent(mockHeroService);
  })

  describe('delete', () => {
    it('should remove the indicated hero from the heroes list', () => {
      mockHeroService.deleteHero.and.returnValue(of(true));
      component.heroes = HEROES;

      component.delete(HEROES[2])

      expect(component.heroes.find(hero => hero === HEROES[2])).toBe(undefined);
    });

    it('should call deleteHero with the correct param', () => {
      mockHeroService.deleteHero.and.returnValue(of(true));
      component.heroes = HEROES;

      component.delete(HEROES[2]);

      expect(mockHeroService.deleteHero).toHaveBeenCalledWith(HEROES[2]);
    })
  })
})

// Shallow Test:
describe('HeroesComponent (shallow test)', () => {
  let fixture: ComponentFixture<HeroesComponent>;
  let HEROES;
  let mockHeroService;

  // Mocking Child Component (HeroComponent)
  @Component({
    selector: 'app-hero',
    template: '<div></div>'
  })
  class FakeHeroComponent {
    @Input() hero: Hero;
    // @Output() delete = new EventEmitter();
  }

  beforeEach(() => {
    HEROES = [
      {id:1, name: 'SpiderDude', strength: 8},
      {id:2, name: 'Wonderful Woman', strength: 24},
      {id:3, name: 'SuperDude', strength: 55},
    ];

    mockHeroService = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero']);

    TestBed.configureTestingModule({
    declarations: [
      HeroesComponent,
      FakeHeroComponent
    ],
    providers:[
      { provide: HeroService, useValue: mockHeroService }
    ],
    // schemas:[NO_ERRORS_SCHEMA] // hide side effect in our template (in console)
    });
  fixture = TestBed.createComponent(HeroesComponent);
  });



  it('should set the heroes correctly from the service', () => {
    mockHeroService.getHeroes.and.returnValue(of(HEROES));
    fixture.detectChanges(); // fire change detection

    expect(fixture.componentInstance.heroes.length).toBe(3);
  });

  it('should render one li for each hero', () => {
    mockHeroService.getHeroes.and.returnValue(of(HEROES));
    fixture.detectChanges(); // fire change detection

    expect(fixture.debugElement.queryAll(By.css('li')).length).toBe(3);
  });

})
