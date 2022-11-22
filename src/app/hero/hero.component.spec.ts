import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing"
import { By } from "@angular/platform-browser";
import { HeroComponent } from "./hero.component";

// Shallow Test
describe('HeroComponent (shallow tests)', () => {
  let fixture: ComponentFixture<HeroComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeroComponent],
      schemas: [NO_ERRORS_SCHEMA] // don't validate the template (there are drawbacks)
    });
    fixture = TestBed.createComponent(HeroComponent);
  });

  it('should have the correct hero',() => {
    fixture.componentInstance.hero = { id:1, name: 'SuperDude', strength: 3};
    // fixture.detectChanges(); // something we commonly do in our integration tests, wait till change detection happen (not in this case)
    expect(fixture.componentInstance.hero.name).toEqual('SuperDude');
  });

it('should render the hero name in an anchor tag', () => {
  fixture.componentInstance.hero = { id:1, name: 'SuperDude', strength: 3};
  fixture.detectChanges();

  // Debug Element:
  let deA = fixture.debugElement.query(By.css('a'));
  expect(deA.nativeElement.textContent).toContain('SuperDude');

  // Native Element:
  // expect(fixture.nativeElement.querySelector('a').textContent).toContain('SuperDude');
});
})
