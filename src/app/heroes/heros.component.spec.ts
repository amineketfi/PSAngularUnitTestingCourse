import { Component, Directive, Input, NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { of } from "rxjs";
import { Hero } from "../hero";
import { HeroService } from "../hero.service";
import { HeroComponent } from "../hero/hero.component";
import { HeroesComponent } from "./heroes.component"

// Isolated test:------------------------------------------------------------
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

// Shallow Test:-----------------------------------
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

});

// Deep Integration Test: -----------------------------------------

@Directive({
  selector: '[routerLink]',
  host: { '(click)': 'onClick()' }
})
export class RouterLinkDirectiveStub {
  @Input('routerLink') linkParams: any;
  navigatedTo: any = null;

  onClick() {
    this.navigatedTo = this.linkParams;
  }
}

describe('HeroesComponent (Deep test)', () => {
  let fixture: ComponentFixture<HeroesComponent>;
  let HEROES;
  let mockHeroService;


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
      HeroComponent,
      RouterLinkDirectiveStub
    ],
    providers:[
      { provide: HeroService, useValue: mockHeroService }
    ],
    // schemas:[NO_ERRORS_SCHEMA] // hide side effect in our template (in console)
    });
    fixture = TestBed.createComponent(HeroesComponent);
    mockHeroService.getHeroes.and.returnValue(of(HEROES));

    // run ngOnInit()
    fixture.detectChanges(); // fire change detection on parent component which means on his childs components
  });



  it('should each hero as a HeroComponent', () => {

    const heroComponentDEs = fixture.debugElement.queryAll(By.directive(HeroComponent));
    for (let i=0; i<heroComponentDEs.length; i++) {
      expect(heroComponentDEs[i].componentInstance.hero).toEqual(HEROES[i]);
    }
  });


  // Triggering Events on Elements
  it(`should call heroService.deleteHero when the Hero Component's
    delete button is clicked`, () => {
      // Jasmine spy on method call
    spyOn(fixture.componentInstance, 'delete');

    const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));

    // by grapping elment<button> and trigger the event handler
    heroComponents[0].query(By.css('button'))
      .triggerEventHandler('click', {stopPropagation: () => {}});

    // by emiting an event from the child component
    // (<HeroComponent> heroComponents[0].componentInstance).delete.emit(undefined);

    // by triggering the event handler from the debug element
    // heroComponents[0].triggerEventHandler('delete', null);

    expect(fixture.componentInstance.delete).toHaveBeenCalledWith(HEROES[0]);
  });

  it('should add a new hero to the list when the add button is clicked', () => {
    const name = "Mr. Ice";
    mockHeroService.addHero.and.returnValue(of({ id: 5, name, strength: 4 }));
    const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    const addButton = fixture.debugElement.queryAll(By.css('button'))[0];

    inputElement.value = name;
    addButton.triggerEventHandler('click', null);
    fixture.detectChanges();
    const heroText = fixture.debugElement.query(By.css('ul')).nativeElement.textContent;
    expect(heroText).toContain(name);
  })

  it('should have the correct route for the first hero', () => {
    const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));

    let routerLink = heroComponents[0]
      .query(By.directive(RouterLinkDirectiveStub))
      .injector.get(RouterLinkDirectiveStub);

    heroComponents[0].query(By.css('a')).triggerEventHandler('click', null);

    expect(routerLink.navigatedTo).toBe('/detail/1');
  });


});
