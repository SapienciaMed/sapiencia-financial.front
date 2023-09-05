
import React from 'react'
import { ITabsMenuTemplate } from '../interfaces/tabs-menu.interface';

interface IAppProps {
    tabs: ITabsMenuTemplate[];
    start?: ITabsMenuTemplate;
    index?: number;
    className?: string;
}

export const TabCreateAddition = ({ tabs, className, start, index }: IAppProps) => {
  return (
    <div className={`tabs-component ${className ? className : ""}`}>
       hola
    </div>
  )
}
