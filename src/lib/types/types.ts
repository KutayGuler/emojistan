import {
  INTERACTABLE_BG,
  INTERACTABLE_BORDER,
  INTERACTABLE_H,
  INTERACTABLE_W,
  MERGER_BG,
  MERGER_BORDER,
  MERGER_H,
  MERGER_W,
  PUSHER_BG,
  PUSHER_BORDER,
  PUSHER_H,
  PUSHER_W,
  CTX_MENU_W,
  CONSUMABLE_BG,
  CONSUMABLE_BORDER,
  CONSUMABLE_H,
  CONSUMABLE_W,
  EQUIPPABLE_BG,
  EQUIPPABLE_BORDER,
  EQUIPPABLE_H,
  EQUIPPABLE_W,
} from "$src/constants";
import type { XYPosition, Position } from "./utils";

export type NodeComponent =
  | "pusher"
  | "merger"
  | "consumable"
  | "equippable"
  | "interactable"
  | "ctxMenu";

export interface Node {
  id: number;
  component: NodeComponent;
  position: XYPosition;
  width: number;
  height: number;
  disabled: boolean;
  bgColor?: string;
  fontSize?: number;
  borderColor?: string;
  borderRadius?: number;
  textColor?: string;
  clickCallback?: Function;
  image?: boolean;
  src?: string;
  sourcePosition?: "left" | "right" | "top" | "bottom";
  targetPosition?: "left" | "right" | "top" | "bottom";
}

// #CF 1
export class Node<T = any> {
  constructor(
    id: number,
    component: NodeComponent,
    position: { x: number; y: number }
  ) {
    this.id = id;
    this.component = component;
    this.position = position;

    switch (component) {
      case "ctxMenu":
        this.width = CTX_MENU_W;
        return;
      case "consumable":
        this.width = CONSUMABLE_W;
        this.height = CONSUMABLE_H;
        this.borderColor = CONSUMABLE_BORDER;
        this.bgColor = CONSUMABLE_BG;
        break;
      case "equippable":
        this.width = EQUIPPABLE_W;
        this.height = EQUIPPABLE_H;
        this.borderColor = EQUIPPABLE_BORDER;
        this.bgColor = EQUIPPABLE_BG;
        break;
      case "interactable":
        this.width = INTERACTABLE_W;
        this.height = INTERACTABLE_H;
        this.borderColor = INTERACTABLE_BORDER;
        this.bgColor = INTERACTABLE_BG;
        return;
      case "pusher":
        this.width = PUSHER_W;
        this.height = PUSHER_H;
        this.borderColor = PUSHER_BORDER;
        this.bgColor = PUSHER_BG;
        return;
      case "merger":
        this.width = MERGER_W;
        this.height = MERGER_H;
        this.borderColor = MERGER_BORDER;
        this.bgColor = MERGER_BG;
        return;
    }
  }
}

export interface Edge {
  id: string;
  source: number;
  target: number;
  label?: string;
  labelBgColor?: string;
  labelTextColor?: string;
  edgeColor?: string;
  type?: string;
  animate?: boolean;
  noHandle?: boolean;
  arrow?: boolean;
}

export interface DerivedEdge extends Edge {
  sourceX: number;
  sourceY: number;
  sourcePosition: Position;
  targetX: number;
  targetY: number;
  targetPosition: Position;
}

export interface EdgeProps extends DerivedEdge {
  path: string;
  centerX: number;
  centerY: number;
}

export interface EdgeTextProps {
  label?: any;
  labelBgColor?: string;
  labelTextColor?: string;
  centerX: number;
  centerY: number;
}

export type HandleType = "source" | "target";
