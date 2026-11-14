import React from 'react';

type AnyProps = Record<string, any>;
const flatten = (style: any): AnyProps => {
  if (!style) return {};
  if (Array.isArray(style)) return Object.assign({}, ...style.map(flatten));
  const out: AnyProps = { ...style };
  if (out.paddingHorizontal != null) { out.paddingLeft = out.paddingRight = out.paddingHorizontal; delete out.paddingHorizontal; }
  if (out.paddingVertical != null) { out.paddingTop = out.paddingBottom = out.paddingVertical; delete out.paddingVertical; }
  if (out.marginHorizontal != null) { out.marginLeft = out.marginRight = out.marginHorizontal; delete out.marginHorizontal; }
  if (out.marginVertical != null) { out.marginTop = out.marginBottom = out.marginVertical; delete out.marginVertical; }
  if (out.textDecorationLine) { out.textDecoration = out.textDecorationLine; delete out.textDecorationLine; }
  if (out.flex === 1) out.minWidth = 0;
  return out;
};
export const StyleSheet = { create: (styles: AnyProps) => styles };
export const Alert = { alert: (title: string, message?: string) => window.alert([title, message].filter(Boolean).join('\n\n')) };
export function View({ children, style, ...props }: AnyProps) { return <div {...props} style={flatten(style)}>{children}</div>; }
export function Text({ children, style, ...props }: AnyProps) { return <span {...props} style={flatten(style)}>{children}</span>; }
export function ScrollView({ children, style, contentContainerStyle, horizontal, showsHorizontalScrollIndicator, ...props }: AnyProps) {
  const merged: React.CSSProperties = { ...flatten(style), ...(horizontal ? { overflowX: 'auto', overflowY: 'hidden', whiteSpace: 'nowrap' } : { overflowY: 'auto' }) };
  const inner: React.CSSProperties = { ...flatten(contentContainerStyle), ...(horizontal ? { display: 'flex', flexDirection: 'row', width: 'max-content', minWidth: '100%' } : {}) };
  return <div {...props} style={merged}><div style={inner}>{children}</div></div>;
}
export function TouchableOpacity({ children, style, onPress, ...props }: AnyProps) {
  return <button type="button" {...props} onClick={onPress} style={{ ...flatten(style), cursor: 'pointer', font: 'inherit' }}>{children}</button>;
}
export function TextInput({ style, onChangeText, multiline, ...props }: AnyProps) {
  const common = { ...props, onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChangeText?.(e.target.value), style: { ...flatten(style), font: 'inherit' } };
  return multiline ? <textarea {...common} /> : <input {...common} />;
}
export function SafeAreaProvider({ children }: AnyProps) { return <>{children}</>; }
export function SafeAreaView({ children, style, ...props }: AnyProps) { return <div {...props} className="safe-area" style={flatten(style)}>{children}</div>; }
