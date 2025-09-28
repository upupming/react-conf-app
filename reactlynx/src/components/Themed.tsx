import type {
  Modify,
  TextProps as TextPropsType,
  ViewProps as ViewPropsType,
  CSSProperties,
} from "@lynx-js/types";
import './Themed.css'

export type TextProps = Modify<
 {
    marginBottom?: string;
    fontSize?: CSSProperties["fontSize"];
    fontWeight?: "light" | "medium" | "bold";
    italic?: boolean;
    animated?: boolean;
    className?: string;
  } & TextPropsType,
  {
    style?: CSSProperties;
  }
>;
export type ViewProps = Modify<
  ViewPropsType & { animated?: boolean; className?: string },
  {
    style?: CSSProperties;
    id?: string;
  }
>;

export function ThemedText(props: TextProps) {
  const {
    style = {},
    fontSize,
    fontWeight,
    italic,
    animated,
    className,
    ...otherProps
  } = props;

  const classNames = [className, 'themed-text'];
  if (fontWeight) {
    classNames.push(`font-${fontWeight}`);
  }
  if (italic) {
    classNames.push("italic");
  }

  const { children, ...restProps } = otherProps;

  return (
    <text
      style={{ fontSize, ...style }}
      className={classNames.join(" ")}
      {...restProps}
    >
      {otherProps.children}
    </text>
  );
}

export function ThemedView(props: ViewProps) {
  const { style, animated, className, ...otherProps } =
    props;
  const { children, ...restProps } = otherProps;

  return (
    <view
      style={style}
      className={ 'themed-view ' + className}
      {...restProps}
    >
      {otherProps.children}
    </view>
  );
}
