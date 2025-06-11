"use client";
import React, { useMemo } from "react";
import Disciplinas from "../../disciplinas/disciplinas";
import { useData } from "@/Context/DataContext";
import { Horario } from "@/lib/types";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { getDay, startOfWeek as dateFnsStartOfWeek, parse, format, addDays } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Header from "../ui/header";

// Configure date-fns localizer
const locales = { "pt-BR": ptBR };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date: Date): Date => dateFnsStartOfWeek(date, { weekStartsOn: 1 }),
  getDay,
  locales,
});

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
}

export default function HorarioManager() {
  const { DisciplinasDisponiveis } = useData();

  // Map disciplines to events
  const events = useMemo<Event[]>(() => {
    const ev: Event[] = [];
    DisciplinasDisponiveis.forEach((disc) => {
      if (!disc.horarios) return;
      disc.horarios.forEach((h: Horario) => {
        const weekdays: Record<string, number> = {
          Segunda: 1,
          Terça: 2,
          Quarta: 3,
          Quinta: 4,
          Sexta: 5,
        };
        const today = new Date();
        const weekdayIndex = weekdays[h.dia];
        const todayIndex = getDay(today) || 7;
        const diffDays = (weekdayIndex - todayIndex + 7) % 7;
        const date = addDays(today, diffDays);
        const [startH, startM] = h.inicio.split(":").map(Number);
        const [endH, endM] = h.fim.split(":").map(Number);
        const start = new Date(date);
        start.setHours(startH, startM, 0, 0);
        const end = new Date(date);
        end.setHours(endH, endM, 0, 0);
        ev.push({ id: `${disc.id}-${h.dia}-${h.inicio}`, title: disc.nome, start, end });
      });
    });
    return ev;
  }, [DisciplinasDisponiveis]);

  return (
    <div className="px-4 pb-4">
      <Header
        title="Organizador de horarios automatico"
        subtitles={
          "Na aba 'Gerenciador Interativo' marque a suas disciplinas já feitas, e as diciplinas disponiveis apareceram aqui automaticamente."
        }
      />
      <div className="overflow-x-scroll">
        <Calendar
          className="text-black capitalize min-w-[1000px] "
          defaultDate={new Date()}
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
          messages={{
            allDay: "Dia inteiro",
            previous: "Anterior",
            next: "Próximo",
            today: "Hoje",
            month: "Mês",
            week: "Semana",
            day: "Dia",
            agenda: "Agenda",
            date: "Data",
            time: "Hora",
            event: "Evento",
            noEventsInRange: "Não há eventos neste intervalo.",
            showMore: (total) => `+ ver mais (${total})`,
          }}
          components={{
            timeGutterHeader: () => <div className="py-1 text-xs font-semibold">Horário</div>,
          }}
          dayLayoutAlgorithm="no-overlap"
          allDayAccessor={() => false}
          showAllEvents={false}
        />
      </div>
    </div>
  );
}
