import {
  Component,
  ViewEncapsulation,
  AfterViewInit,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";

@Component({
  selector: "automation-actions-button",
  templateUrl: "./automation-actions-button.component.html",
  styleUrls: ["./automation-actions-button.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class AutomationActionsButtonComponent implements AfterViewInit {
  @Output("onReset") onResetApp = new EventEmitter();
  @Input() elementsList: HTMLElement[] = [];
  highlightedElements: HTMLElement[] = [];
  isChosen = false;
  isDone = false;

  private getListOfElements = (element: HTMLElement) => {
    let result: HTMLElement[] = [];
    let className = "";
    let tagName = element.tagName;

    for (let i = 0; i < element.classList.length; i++) {
      className += "." + element.classList[i];
    }

    for (let i = 0; i < this.elementsList.length; i++) {
      let button = this.elementsList[i].querySelector(
        `${tagName.toLowerCase()}${className}`
      );
      if (button) result.push(button as HTMLElement);
      if (
        this.elementsList[i].tagName === tagName &&
        this.elementsList[i].className === element.className
      ) {
        result.push(this.elementsList[i] as HTMLElement);
      }
    }

    return result;
  };

  private unHighlightElements(list: HTMLCollection | HTMLElement[]) {
    for (let i = 0; i < list.length; i++) {
      list[i].classList.remove("highlighted");
    }
  }

  private highlightList(list: HTMLCollection | HTMLElement[]) {
    for (let i = 0; i < list.length; i++) {
      list[i].classList.add("highlighted");
    }
  }

  private mouseOverListener = (event: MouseEvent) => {
    let element = event.target as HTMLElement;
    if (!element.closest(".clicked")) return;

    let buttons = this.getListOfElements(element);

    this.unHighlightElements(this.highlightedElements);

    this.highlightedElements = buttons;
    this.highlightList(buttons);
  };

  private clickListener = (event: MouseEvent) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    if (this.highlightedElements.length) this.isChosen = true;
    document.removeEventListener("mouseover", this.mouseOverListener);
    document.removeEventListener("click", this.clickListener, true);
  };

  ngAfterViewInit() {
    document.querySelector(".automation-overlay")?.classList.add("in");
    document.addEventListener("mouseover", this.mouseOverListener);
    document.addEventListener("click", this.clickListener, true);
  }

  runBot() {
    for (let i = 0; i < this.highlightedElements.length; i++) {
      this.highlightedElements[i].click();
    }
    this.isDone = true;
    document.querySelector(".automation-overlay")?.classList.remove("in");
  }

  reset() {
    this.isChosen = false;
    this.isDone = false;
    this.unHighlightElements(this.highlightedElements);
    this.highlightedElements = [];
    document.querySelector(".automation-overlay")?.classList.add("in");
    document.addEventListener("mouseover", this.mouseOverListener);
    document.addEventListener("click", this.clickListener, true);
  }

  ngOnDestroy() {
    document.removeEventListener("mouseover", this.mouseOverListener);
    document.removeEventListener("click", this.clickListener, true);
  }
}
