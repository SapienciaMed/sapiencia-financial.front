import { DateTime } from "luxon";

export function calculateDifferenceYear(
  dateInit: string | Date,
  dateEnd?: string | Date
) {
  const currentDate = dateEnd ? new Date(dateEnd) : new Date();
  const differenceInMilliseconds =
    currentDate.getTime() - new Date(dateInit).getTime();
  const differenceInYears =
    differenceInMilliseconds / (24 * 60 * 60 * 1000 * 365);
  return Math.floor(differenceInYears);
}

export function calculateDifferenceDays(
  dateInit: string | Date,
  dateEnd?: string | Date
) {
  const currentDate = dateEnd ? new Date(dateEnd) : new Date();
  const differenceInMilliseconds =
    currentDate.getTime() - new Date(dateInit).getTime();
  const differenceInDays = differenceInMilliseconds / (24 * 60 * 60 * 1000) + 1;
  return Math.floor(differenceInDays);
}

export function addCalendarDays(date, daysToAdd, substractionOneDay = true) {
  if (substractionOneDay) {
    const oneDay = 24 * 60 * 60 * 1000;
    const inputDate = new Date(date);
    const newDate = new Date(inputDate.getTime() + (daysToAdd - 1) * oneDay);

    return newDate;
  } else {
    const oneDay = 24 * 60 * 60 * 1000;
    const inputDate = new Date(date);
    const newDate = new Date(inputDate.getTime() + daysToAdd * oneDay);

    return newDate;
  }
}

export function calculateBusinessDays(startDate, endDate, holidays = []) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const oneDay = 24 * 60 * 60 * 1000;
  let businessDays = 0;

  // Incluye el último día en el cálculo si es hábil y no es festivo
  while (start <= end) {
    if (
      isBusinessDay(start) &&
      !holidays.some((holiday) => isSameDay(holiday, start))
    ) {
      businessDays++;
    }
    start.setTime(start.getTime() + oneDay);
  }

  return businessDays;
}

function isSameDay(date, nextDate) {
  return (
    date.getFullYear() === nextDate.getFullYear() &&
    date.getMonth() === nextDate.getMonth() &&
    date.getDate() === nextDate.getDate()
  );
}
function isBusinessDay(date) {
  const dayOfWeek = date.getDay(); // 0 (Sunday) to 6 (Saturday)
  return dayOfWeek !== 0 && dayOfWeek !== 6; // Excludes weekends (Saturday and Sunday)
}

export function calculateMayorEdad(birthDate) {
  const birthDateFormated = new Date(birthDate);

  const age = calculateDifferenceYear(birthDateFormated);

  return age >= 18;
}

export function calculateLimiteEdad(birthDate) {
  const birthDateFormated = new Date(birthDate);

  const age = calculateDifferenceYear(birthDateFormated);

  return age < 80;
}

export function formaterNumberToCurrency(number) {
  const formatter = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 2,
  });

  return formatter.format(number);
}

export function addBusinessDays(startDate, daysToAdd, holidays = []) {
  const oneDay = 24 * 60 * 60 * 1000; // Un día en milisegundos
  let currentDate = new Date(startDate);

  const isHoliday = (date) => {
    const formattedDate = date.toISOString().slice(0, 10); // Formatear fecha como 'AAAA-MM-DD'
    return holidays.includes(formattedDate);
  };

  let daysAdded = 0;

  while (daysAdded < daysToAdd) {
    if (isBusinessDay(currentDate) && !isHoliday(currentDate)) {
      daysAdded++;
    }
    if (daysAdded < daysToAdd) {
      currentDate.setTime(currentDate.getTime() + oneDay);
    }
  }

  return currentDate;
}

export function removeEmptySpace(phrase: string) {
  if (!phrase) {
    return "";
  }
  const wordsArray = phrase.split(" ");
  return wordsArray.filter((word) => word !== "");
}

export function calculateIncrement(
  valueOriginal: number,
  percentageValue: number
) {
  const factorIncrement: number = percentageValue / 100;

  const increment: number = valueOriginal * factorIncrement;

  const newValue: number = valueOriginal + increment;

  return newValue;
}

export function caculatePorcentual(valueOriginal: number, valueNew: number) {
  const porcentajeAumento: number =
    ((valueNew - valueOriginal) / valueOriginal) * 100;

  return porcentajeAumento;
}

export const jsDateToSQLDate = (jsDate: Date) => {
  return DateTime.fromJSDate(jsDate).toSQLDate();
};

export const jsDateToISODate = (jsDate: Date) => {
  return DateTime.fromJSDate(jsDate).toISODate();
};


