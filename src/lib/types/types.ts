import {
  INTERACTABLE_H,
  INTERACTABLE_W,
  MERGER_BG,
  MERGER_BORDER,
  MERGER_H,
  MERGER_W,
  PUSHER_H,
  PUSHER_W,
  SPAWNER_W,
} from "$src/constants";
import type { XYPosition, Position } from "./utils";

export type NodeComponent = "pusher" | "interactable" | "merger" | "spawner";

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
      case "spawner":
        this.width = SPAWNER_W / 2;
        return;
      case "interactable":
        this.width = INTERACTABLE_W;
        this.height = INTERACTABLE_H;
        this.borderColor = MERGER_BORDER;
        this.bgColor = MERGER_BG;
        return;
      case "pusher":
        this.width = PUSHER_W;
        this.height = PUSHER_H;
        this.borderColor = MERGER_BORDER;
        this.bgColor = MERGER_BG;
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
