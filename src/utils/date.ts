import { formatDistanceToNowStrict } from 'date-fns';
import { enUS } from 'date-fns/locale';

export const getRelativeTime = (isoDateString: string): string => {
  try {
    const date = new Date(isoDateString);
    const distance = formatDistanceToNowStrict(date, {
      addSuffix: false,
      locale: enUS,
    });

    return distance
      .replace(' seconds', 's')
      .replace(' second', 's')
      .replace(' minutes', 'm')
      .replace(' minute', 'm')
      .replace(' hours', 'h')
      .replace(' hour', 'h')
      .replace(' days', 'd')
      .replace(' day', 'd')
      .replace(' months', 'mo')
      .replace(' years', 'y');
  } catch (error) {
    return '';
  }
};
