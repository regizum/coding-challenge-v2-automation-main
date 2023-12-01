import {
  Component,
  AfterViewInit,
  ViewEncapsulation,
  Output,
  EventEmitter,
} from "@angular/core";

@Component({
  selector: "automation-for-loop",
  templateUrl: "./automation-for-loop.component.html",
  styleUrls: ["./automation-for-loop.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class AutomationForLoopComponent implements AfterViewInit {
  @Output() onSaveItems = new EventEmitter<HTMLElement[]>();

  highlightedElements: HTMLElement[] = [];
  clickedElements: HTMLElement[] = [];
  parentNestings = 5;

  private getPossibleList = (
    element: HTMLElement,
    childClassName: string,
    className: string,
    tagName: string
  ): HTMLElement[] => {
    const children = element.children;
    let result: HTMLElement[] = [];

    if (children.length < 2) {
      return [];
    }

    for (let i = 0; i < children.length; i++) {
      if (className) {
        if (
          children[i].classList.contains(className) &&
          children[i].tagName === tagName &&
          children[i].querySelector(`.${childClassName}`)
        ) {
          result.push(
            children[i].querySelector(`.${childClassName}`) as HTMLElement
          );
        }
      } else if (
        children[i].tagName === tagName &&
        children[i].querySelector(`.${childClassName}`)
      ) {
        result.push(
          children[i].querySelector(`.${childClassName}`) as HTMLElement
        );
      }
    }

    return result;
  };

  private getArrayFromUL = (list: HTMLCollection, className: string) => {
    let result: HTMLElement[] = [];

    for (let i = 0; i < list.length; i++) {
      if (className && list[i].classList.contains(className)) {
        result.push(list[i] as HTMLElement);
      } else if (list[i].querySelector(`.${className}`)) {
        result.push(list[i].querySelector(`.${className}`) as HTMLElement);
      }
    }

    return result;
  };

  private getListOfElements = (element: HTMLElement) => {
    let parent = element.parentElement;
    let prevParent = element;
    let i = 0;
    let posssibleList: HTMLElement[];

    while (i < this.parentNestings) {
      if (parent && parent.tagName === "UL") {
        return this.getArrayFromUL(parent.children, element.classList[0]);
      } else if (parent) {
        posssibleList = this.getPossibleList(
          parent,
          element.classList[0],
          prevParent.classList[0],
          prevParent.tagName
        );

        if (posssibleList.length > 1) {
          return posssibleList;
        }
      }

      if (parent && parent.parentElement) {
        prevParent = parent;
        parent = parent.parentElement;
      }
      i++;
    }

    return null;
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
    if (element.closest("automation")) return;

    let children = this.getListOfElements(element);

    this.unHighlightElements(this.highlightedElements);

    if (children) {
      this.highlightedElements = children;
      this.highlightList(children);
    }
  };

  private clickListener = (event: MouseEvent) => {
    let element = event.target as HTMLElement;
    if (
      element.closest("automation") ||
      !this.highlightedElements ||
      !("length" in this.highlightedElements)
    )
      return;

    event.preventDefault();
    event.stopImmediatePropagation();

    for (let i = 0; i < this.highlightedElements.length; i++) {
      if (this.highlightedElements[i].contains(element)) {
        this.highlightedElements[i].classList.add("clicked");
        this.clickedElements.push(this.highlightedElements[i]);
        document.removeEventListener("mouseover", this.mouseOverListener);
        break;
      }
    }

    if (this.clickedElements.length > 1) {
      document.removeEventListener("click", this.clickListener, true);
    }
  };

  reset() {
    this.unHighlightElements(this.highlightedElements);
    this.highlightedElements = [];

    for (let i = 0; i < this.clickedElements.length; i++) {
      this.clickedElements[i].classList.remove("clicked");
    }

    this.clickedElements = [];
    document.addEventListener("mouseover", this.mouseOverListener);
  }

  save() {
    this.onSaveItems.emit(this.highlightedElements);
    for (let i = 0; i < this.highlightedElements.length; i++) {
      this.highlightedElements[i].classList.remove("highlighted");
      if (!this.highlightedElements[i].classList.contains("clicked"))
        this.highlightedElements[i].classList.add("clicked");
    }
  }

  ngAfterViewInit() {
    document.addEventListener("mouseover", this.mouseOverListener);
    document.addEventListener("click", this.clickListener, true);
  }

  ngOnDestroy() {
    document.removeEventListener("mouseover", this.mouseOverListener);
    document.removeEventListener("click", this.clickListener, true);
  }
}
