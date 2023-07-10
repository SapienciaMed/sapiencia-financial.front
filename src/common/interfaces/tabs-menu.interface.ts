export interface ITabsMenuTemplate {
    id: number | string;
    title: string;
    content?: React.JSX.Element | string;
    action?: () => void;
}