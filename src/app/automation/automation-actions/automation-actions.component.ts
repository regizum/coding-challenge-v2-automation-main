import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "automation-actions",
  templateUrl: "./automation-actions.component.html",
  styleUrls: ["./automation-actions.component.scss"],
})
export class AutomationActionsComponent {
  @Output() onChooseAnAction = new EventEmitter<string>();
}
