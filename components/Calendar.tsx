import React, { useState, useMemo } from 'react';
import { ArrowLeftIcon, ArrowRightIcon, BellIcon, CheckCircleIcon, ClockIcon, ExclamationTriangleIcon, PencilIcon, PlusIcon, TrashIcon, XMarkIcon } from './icons/Icons';

interface CalendarEvent {
  id: number;
  title: string;
  date: Date;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  urgency: 'high' | 'medium' | 'low';
  time?: string;
  notes?: string;
  reminder: 'none' | '1h' | '1d' | '2d';
}

const today = new Date();
today.setHours(0, 0, 0, 0);

const getRelativeDate = (dayOffset: number) => {
    const date = new Date();
    date.setDate(new Date().getDate() + dayOffset);
    return date;
}


const mockEvents: CalendarEvent[] = [
  { id: 1, title: "Aluguel", date: getRelativeDate(-2), amount: 1200, status: 'overdue', urgency: 'high', time: '10:00', notes: 'Pago via PIX', reminder: '1d' },
  { id: 2, title: "Fatura Cartão", date: getRelativeDate(3), amount: 854.90, status: 'pending', urgency: 'high', time: '09:00', notes: '', reminder: 'none' },
  { id: 3, title: "Internet", date: getRelativeDate(8), amount: 99.90, status: 'pending', urgency: 'medium', time: '14:00', notes: 'Débito automático', reminder: '2d' },
  { id: 4, title: "Salário", date: today, amount: 5000, status: 'paid', urgency: 'low', time: '08:00', notes: 'Adiantamento recebido', reminder: 'none' },
  { id: 5, title: "Conta de Luz", date: getRelativeDate(10), amount: 150.25, status: 'pending', urgency: 'medium', time: '11:00', notes: '', reminder: '1d' },
  { id: 6, title: "Assinatura Netflix", date: getRelativeDate(15), amount: 39.90, status: 'pending', urgency: 'low', time: '00:00', notes: '', reminder: 'none' },
  { id: 7, title: "Consulta Médica", date: today, amount: 250.00, status: 'pending', urgency: 'high', time: '15:30', notes: 'Dr. Roberto', reminder: '1h' },
];


const dateToISOString = (date: Date) => date.toISOString().split('T')[0];

const EventModal: React.FC<{
    event: Partial<CalendarEvent> | null;
    onClose: () => void;
    onSave: (event: Omit<CalendarEvent, 'id'> & { id?: number }) => void;
}> = ({ event, onClose, onSave }) => {
    // FIX: Omitted 'date' from CalendarEvent before intersecting to avoid creating a `Date & string` type for the date property.
    const [formData, setFormData] = useState<Omit<CalendarEvent, 'id' | 'date'> & { id?: number; date: string }>({
        title: event?.title || '',
        amount: event?.amount || 0,
        status: event?.status || 'pending',
        urgency: event?.urgency || 'medium',
        date: event?.date ? dateToISOString(event.date) : dateToISOString(new Date()),
        time: event?.time || '',
        notes: event?.notes || '',
        reminder: event?.reminder || 'none',
        id: event?.id
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'amount' ? parseFloat(value) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, date: new Date(formData.date + 'T00:00:00') });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-dark-gray">{event?.id ? 'Editar' : 'Agendar'} Evento</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-dark-gray"><XMarkIcon className="w-6 h-6" /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                    <InputField name="title" label="Título" value={formData.title} onChange={handleChange} required />
                    <div className="grid grid-cols-2 gap-4">
                        <InputField name="amount" label="Valor (R$)" type="number" value={formData.amount} onChange={handleChange} required />
                        <SelectField name="status" label="Status" value={formData.status} onChange={handleChange} options={[
                            { value: 'pending', label: 'Pendente' },
                            { value: 'paid', label: 'Pago' },
                            { value: 'overdue', label: 'Atrasado' },
                        ]} />
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <InputField name="date" label="Data" type="date" value={formData.date} onChange={handleChange} required />
                        <InputField name="time" label="Hora" type="time" value={formData.time} onChange={handleChange} />
                    </div>
                    <SelectField name="urgency" label="Urgência" value={formData.urgency} onChange={handleChange} options={[
                        { value: 'low', label: 'Baixa' },
                        { value: 'medium', label: 'Média' },
                        { value: 'high', label: 'Alta' },
                    ]} />
                    <TextAreaField name="notes" label="Anotações" value={formData.notes} onChange={handleChange} placeholder="Adicione detalhes aqui..." />
                    <SelectField name="reminder" label="Lembrete / Alarme" value={formData.reminder} onChange={handleChange} options={[
                        { value: 'none', label: 'Nenhum' },
                        { value: '1h', label: '1 hora antes' },
                        { value: '1d', label: '1 dia antes' },
                        { value: '2d', label: '2 dias antes' },
                    ]} />

                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-light-gray text-dark-gray rounded-lg hover:bg-gray-200">Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-primary-green text-white rounded-lg hover:bg-green-800">Salvar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const getCountdownText = (date: Date, status: CalendarEvent['status']): string => {
    if (status === 'paid') return 'Evento pago';

    const eventDate = new Date(date);
    eventDate.setHours(0, 0, 0, 0);

    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        return "Vence hoje";
    } else if (diffDays > 0) {
        return `Vence em ${diffDays} dia${diffDays > 1 ? 's' : ''}`;
    } else {
        return `Vencido há ${Math.abs(diffDays)} dia${Math.abs(diffDays) > 1 ? 's' : ''}`;
    }
};

const UrgencyBadge: React.FC<{ urgency: 'high' | 'medium' | 'low' }> = ({ urgency }) => {
    const styles = {
        high: 'bg-red-100 text-red-700',
        medium: 'bg-yellow-100 text-yellow-700',
        low: 'bg-green-100 text-green-700'
    };
    const text = {
        high: 'Alta',
        medium: 'Média',
        low: 'Baixa'
    }
    return <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${styles[urgency]}`}>{text[urgency]}</span>
}


const EventListModal: React.FC<{
    date: Date;
    events: CalendarEvent[];
    onClose: () => void;
    onEdit: (event: CalendarEvent) => void;
    onDelete: (id: number) => void;
}> = ({ date, events, onClose, onEdit, onDelete }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-dark-gray">Eventos de {date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' })}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-dark-gray"><XMarkIcon className="w-6 h-6" /></button>
                </div>
                <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                    {events.length > 0 ? events.map(event => (
                        <div key={event.id} className="p-3 bg-light-gray rounded-lg">
                           <div className="flex items-start justify-between">
                                <div>
                                    <p className="font-semibold">{event.title}</p>
                                    <p className="text-sm text-gray-600">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(event.amount)}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => onEdit(event)} className="text-gray-400 hover:text-primary-green"><PencilIcon className="w-5 h-5"/></button>
                                    <button onClick={() => onDelete(event.id)} className="text-gray-400 hover:text-red-500"><TrashIcon className="w-5 h-5"/></button>
                                </div>
                           </div>
                           <div className="mt-2 pt-2 border-t border-gray-200 space-y-2">
                               <div className="flex items-center justify-between text-xs">
                                   <UrgencyBadge urgency={event.urgency} />
                                   <p className="font-medium text-gray-600">{getCountdownText(event.date, event.status)}</p>
                               </div>
                               {event.notes && <p className="text-xs text-gray-500 bg-white p-2 rounded"><strong>Anotação:</strong> {event.notes}</p>}
                               {event.time && <p className="text-xs text-gray-500 flex items-center gap-1"><ClockIcon className="w-3 h-3"/> {event.time}</p>}
                           </div>
                        </div>
                    )) : <p className="text-gray-500 text-center py-4">Nenhum evento para este dia.</p>}
                </div>
            </div>
        </div>
    );
};


const InputField = (props: React.ComponentProps<'input'> & { label: string }) => (
    <div>
        <label className="text-sm font-medium text-dark-gray block mb-1">{props.label}</label>
        <input {...props} className="w-full border-gray-300 rounded-lg focus:ring-primary-green focus:border-primary-green text-sm" />
    </div>
);

const SelectField = (props: React.ComponentProps<'select'> & { label: string; options: {value: string; label: string}[] }) => (
    <div>
        <label className="text-sm font-medium text-dark-gray block mb-1">{props.label}</label>
        <select {...props} className="w-full border-gray-300 rounded-lg focus:ring-primary-green focus:border-primary-green text-sm">
            {props.options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
    </div>
);

const TextAreaField = (props: React.ComponentProps<'textarea'> & { label: string }) => (
    <div>
        <label className="text-sm font-medium text-dark-gray block mb-1">{props.label}</label>
        <textarea {...props} rows={3} className="w-full border-gray-300 rounded-lg focus:ring-primary-green focus:border-primary-green text-sm" />
    </div>
);


export const Calendar: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [events, setEvents] = useState<CalendarEvent[]>(mockEvents);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isListModalOpen, setIsListModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Partial<CalendarEvent> | null>(null);

    const handleSave = (eventData: Omit<CalendarEvent, 'id'> & { id?: number }) => {
        if (eventData.id) {
            setEvents(events.map(e => e.id === eventData.id ? { ...eventData } as CalendarEvent : e));
        } else {
            setEvents([...events, { ...eventData, id: Math.max(0, ...events.map(e => e.id)) + 1 } as CalendarEvent]);
        }
        setIsEditModalOpen(false);
        setEditingEvent(null);
    };
    
    const handleDelete = (id: number) => {
        setEvents(events.filter(e => e.id !== id));
        // If the last event of the day is deleted, close the list modal
        const eventsForDay = events.filter(e => e.date.toDateString() === selectedDate.toDateString());
        if(eventsForDay.length === 1 && eventsForDay[0].id === id) {
            setIsListModalOpen(false);
        }
    };
    
    const handleDayClick = (date: Date) => {
        setSelectedDate(date);
        const eventsForDay = events.filter(e => e.date.toDateString() === date.toDateString());
        if (eventsForDay.length > 0) {
            setIsListModalOpen(true);
        } else {
            // Optionally open edit modal directly if no events
            // setEditingEvent({ date });
            // setIsEditModalOpen(true);
        }
    };

    const handleEditFromList = (event: CalendarEvent) => {
        setIsListModalOpen(false);
        setEditingEvent(event);
        setIsEditModalOpen(true);
    };

    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDayOfWeek = startOfMonth.getDay();
    const daysInMonth = endOfMonth.getDate();

    const calendarDays = [];
    for (let i = 0; i < startDayOfWeek; i++) {
        calendarDays.push(<div key={`empty-${i}`} className="border-r border-b"></div>);
    }
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const isToday = date.toDateString() === new Date().toDateString();
        const isSelected = date.toDateString() === selectedDate.toDateString();
        const eventsForDay = events.filter(e => e.date.toDateString() === date.toDateString());

        calendarDays.push(
            <div key={day} onClick={() => handleDayClick(date)} className={`p-2 border-r border-b relative cursor-pointer transition-colors min-h-[100px] ${isSelected ? 'bg-green-100' : 'hover:bg-gray-50'}`}>
                <span className={`flex items-center justify-center w-7 h-7 rounded-full text-sm ${isToday ? 'bg-primary-green text-white font-bold' : ''} ${isSelected ? 'font-bold' : ''}`}>
                    {day}
                </span>
                <div className="flex justify-start pl-1 mt-1 space-x-1">
                    {eventsForDay.slice(0, 3).map(event => {
                        const color = event.status === 'paid' ? 'bg-green-500' : event.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500';
                        return <div key={event.id} className={`w-2 h-2 rounded-full ${color}`}></div>
                    })}
                </div>
            </div>
        );
    }

    const changeMonth = (offset: number) => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
    };

    const eventsForSelectedDay = useMemo(() => {
        return events.filter(e => e.date.toDateString() === selectedDate.toDateString());
    }, [events, selectedDate]);

    return (
        <div className="space-y-6">
            {isEditModalOpen && <EventModal event={editingEvent} onClose={() => { setIsEditModalOpen(false); setEditingEvent(null); }} onSave={handleSave} />}
            {isListModalOpen && <EventListModal date={selectedDate} events={eventsForSelectedDay} onClose={() => setIsListModalOpen(false)} onEdit={handleEditFromList} onDelete={handleDelete} />}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                 <h2 className="text-3xl font-bold text-dark-gray">Calendário de Pagamentos</h2>
                 <button onClick={() => { setEditingEvent({ date: selectedDate }); setIsEditModalOpen(true); }} className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-green text-white rounded-lg font-semibold hover:bg-green-800 transition-colors shadow">
                    <PlusIcon className="w-5 h-5" />
                    Agendar Evento
                </button>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md">
                <div className="flex justify-between items-center mb-4 px-2">
                    <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-100"><ArrowLeftIcon className="w-5 h-5"/></button>
                    <h3 className="text-lg font-bold text-dark-gray">
                        {currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' }).replace(/^\w/, c => c.toUpperCase())}
                    </h3>
                    <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-100"><ArrowRightIcon className="w-5 h-5"/></button>
                </div>
                <div className="grid grid-cols-7 text-center text-xs text-gray-500 font-semibold border-t border-r border-l">
                    {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => <div key={day} className="py-2 border-b">{day}</div>)}
                </div>
                <div className="grid grid-cols-7 text-sm border-l">{calendarDays}</div>
            </div>
        </div>
    );
};
