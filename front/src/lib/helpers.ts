import { ComponentItem } from '../store/edit/reducer';

export const searchComponentByName = (
  componentList: ComponentItem[],
  thisComponentName: string,
) => {
  const item = componentList.filter(item => item.name === thisComponentName)[0];
  const tag = item.component;

  return tag;
};
