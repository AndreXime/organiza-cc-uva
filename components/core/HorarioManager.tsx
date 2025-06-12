"use client";
import { useMemo } from "react";
import { useData } from "@/context/DataContext";
import { CalendarEvent, DisciplinaComPeriodo } from "@/lib/types";
import { Calendar } from "react-big-calendar";
import { format, startOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Header from "../ui/header";
import { setHoursAndMinutes, getDateForWeekday, localizer, calendarMessages, weekdays } from "@/lib/CalendarHelper";
import { formatPeriodo } from "@/lib/utils";

function buildEvents(disciplinas: DisciplinaComPeriodo[]): CalendarEvent[] {
  return disciplinas.flatMap((disc) =>
    (disc.horarios || []).map((h) => {
      const date = getDateForWeekday(weekdays[h.dia]);
      const [sh, sm] = h.inicio.split(":").map(Number);
      const [eh, em] = h.fim.split(":").map(Number);
      return {
        id: `${disc.id}-${h.dia}-${h.inicio}`,
        title: disc.nome,
        start: setHoursAndMinutes(date, sh, sm),
        end: setHoursAndMinutes(date, eh, em),
        subtitle: formatPeriodo(disc.periodo),
      };
    })
  );
}

function EventCard({ event }: { event: CalendarEvent }) {
  return (
    <div>
      <div className="font-semibold text-sm">{event.title}</div>
      {event.subtitle && <div className="text-sm">{event.subtitle}</div>}
    </div>
  );
}

export default function HorarioManager() {
  const { DisciplinasDisponiveis } = useData();

  const events = useMemo(() => buildEvents(DisciplinasDisponiveis), [DisciplinasDisponiveis]);

  return (
    <div className="px-4 pb-4">
      <Header
        title="Organizador de horarios"
        subtitles={
          "Na aba 'Gerenciador Interativo' marque a suas disciplinas já feitas, e as diciplinas disponiveis apareceram aqui automaticamente."
        }
      />
      <div className="overflow-x-scroll">
        <Calendar
          className="text-black capitalize min-w-[1000px] "
          defaultDate={startOfWeek(new Date(), { weekStartsOn: 1 })}
          localizer={localizer}
          defaultView="work_week"
          views={["work_week"]}
          events={events}
          step={30}
          timeslots={1}
          scrollToTime={new Date(1970, 1, 1, 8, 0)}
          min={new Date(0, 0, 0, 8, 0)}
          max={new Date(0, 0, 0, 22, 0)}
          startAccessor="start"
          endAccessor="end"
          titleAccessor="title"
          dayPropGetter={() => ({ style: { backgroundColor: "#f9f9f9" } })}
          formats={{
            dayFormat: (date) => format(date, "EEEE", { locale: ptBR }),
            timeGutterFormat: "HH:mm",
            eventTimeRangeFormat: ({ start, end }) =>
              `${format(start, "HH:mm", { locale: ptBR })} - ${format(end, "HH:mm", { locale: ptBR })}`,
          }}
          toolbar={false}
          components={{
            event: EventCard,
            timeGutterHeader: () => <div className="py-1 text-xs font-semibold">Horário</div>,
          }}
          messages={calendarMessages}
          dayLayoutAlgorithm="no-overlap"
          allDayAccessor={() => false}
          showAllEvents={true}
        />
      </div>
    </div>
  );
}
