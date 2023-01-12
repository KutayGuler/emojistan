import {
  EVENT_BG,
  EVENT_H,
  EVENT_W,
  LOOPEVENT_H,
  LOOPEVENT_W,
  MERGER_BG,
  MERGER_BORDER,
  MERGER_H,
  MERGER_W,
  PUSHER_H,
  PUSHER_W,
} from "$src/constants";
import type { XYPosition, Position } from "./utils";

export type NodeComponent =
  | "pusher"
  | "interactable"
  | "merger"
  | "event"
  | "loopEvent"
  | "spawner";

export interface Node<T = any> {
  id: number;
  component: NodeComponent;
  position: XYPosition;
  data: T;
  width: number;
  height: number;
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

export class Node<T = any> {
  constructor(
    id: number,
    component: NodeComponent,
    position: { x: number; y: number },
    receiver: boolean
  ) {
    this.id = id;
    this.component = component;
    this.position = position;

    switch (component) {
      case "spawner":
        this.width = EVENT_W / 2;
        return;
      case "interactable":
      case "pusher":
        this.width = PUSHER_W * 2;
        this.height = PUSHER_H * 4;
        this.borderColor = MERGER_BORDER;
        this.bgColor = MERGER_BG;
        return;
      case "merger":
        this.width = MERGER_W;
        this.height = MERGER_H;
        this.borderColor = MERGER_BORDER;
        this.bgColor = MERGER_BG;
        return;

      case "loopEvent":
        this.width = LOOPEVENT_W;
        this.height = LOOPEVENT_H;
        this.borderColor = "#f6fafd";
        this.bgColor = EVENT_BG;
        break;
      case "event":
        this.width = EVENT_W;
        this.height = EVENT_H;
        this.borderColor = "#f6fafd";
        this.bgColor = EVENT_BG;
        break;
    }

    if (receiver) {
      this.targetPosition = "left";
    } else {
      this.sourcePosition = "right";
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
