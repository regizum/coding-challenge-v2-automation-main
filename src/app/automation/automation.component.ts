import { Component } from "@angular/core";

@Component({
  selector: "automation",
  templateUrl: "./automation.component.html",
  styleUrls: ["./automation.component.scss"],
})
export class AutomationComponent {
  items: HTMLElement[] = [];
  step: number = 1;
  action: string = "";

  onSaveItems = (items: HTMLElement[]) => {
    this.items = items;
    this.step = 2;
  };

  onChooseAnAction = (action: string) => {
    this.step = 3;
    this.action = action;
  };

  onReset = () => {
    this.step = 1;
    this.action = "";
    this.items.forEach((item) => {
      item.classList.remove("highlighted");
      item.classList.remove("clicked");
    });
    this.items = [];
    console.log('reset');
  };
}
