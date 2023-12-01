import {
  Component,
  ViewEncapsulation,
  AfterViewInit,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";

@Component({
  selector: "automation-actions-input",
  templateUrl: "./automation-actions-input.component.html",
  styleUrls: ["./automation-actions-input.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class AutomationActionsInputComponent implements AfterViewInit {
  @Output('onReset') onResetApp = new EventEmitter();
  @Input() elementsList: HTMLElement[] = [];

  highlightedElements: HTMLElement[] = [];
  isChosen = false;
  isDone = false;
  text = "";

  private getListOfElements = () => {
    let result: HTMLElement[] = [];
    let tagName = "input";

    for (let i = 0; i < this.elementsList.length; i++) {
      let input = this.elementsList[i].querySelector(
        `${tagName.toLowerCase()}`
      );
      if (input) result.push(input as HTMLElement);
      if (this.elementsList[i].tagName === tagName.toUpperCase()) {
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

    let inputs = this.getListOfElements();

    this.unHighlightElements(this.highlightedElements);

    this.highlightedElements = inputs;
    this.highlightList(inputs);
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
      (this.highlightedElements[i] as HTMLInputElement).value = this.text;
    }
    this.isDone = true;
    document.querySelector(".automation-overlay")?.classList.remove("in");
  }

  reset() {
    this.isChosen = false;
    this.isDone = false;
    this.text = "";
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
