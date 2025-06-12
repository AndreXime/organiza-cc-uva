import { getDay, startOfWeek, parse, format, setDay } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { dateFnsLocalizer } from "react-big-calendar";
import { Horario } from "./types";

function getDateForWeekday(targetWeekday: number, fromDate = new Date()): Date {
  const weekStart = startOfWeek(fromDate, { weekStartsOn: 1 });
  return setDay(weekStart, targetWeekday, { weekStartsOn: 1 });
}

function setHoursAndMinutes(base: Date, hours: number, minutes: number): Date {
  const d = new Date(base);
  d.setHours(hours, minutes, 0, 0);
  return d;
}

// Configurar date-fns localizer
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date: Date): Date => startOfWeek(date, { weekStartsOn: 1 }),
  getDay,
  locales: { "pt-BR": ptBR },
});

const weekdays: Record<Horario["dia"], number> = {
  Segunda: 1,
  Terça: 2,
  Quarta: 3,
  Quinta: 4,
  Sexta: 5,
};

const calendarMessages = {
  allDay: "Dia inteiro",
  previous: "Anterior",
  next: "Próximo",
  today: "Hoje",
  month: "Mês",
  week: "Semana",
  day: "Dia",
  date: "Data",
  time: "Hora",
  event: "Evento",
  noEventsInRange: "Não há eventos neste intervalo.",
  showMore: (total: number) => `+ ver mais (${total})`,
};

export { getDateForWeekday, setHoursAndMinutes, localizer, calendarMessages, weekdays };
