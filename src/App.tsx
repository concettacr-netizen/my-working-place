/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TabType, Shift, Colleague, TimeEntry, Notice, UserProfile, Payslip, Channel, ChatMessage, Employee } from './types';
import {
  initialUserProfile,
  initialShifts,
  initialColleagues,
  initialNotices,
  initialTimeEntries,
  initialChannels,
  initialChatMessages,
  initialPayslips,
  initialEmployees,
} from './data/mockData';
import { AndroidFrame } from './components/AndroidFrame';
import { OversigtScreen } from './components/screens/OversigtScreen';
import { VagterScreen } from './components/screens/VagterScreen';
import { StempelurScreen } from './components/screens/StempelurScreen';
import { BeskederScreen } from './components/screens/BeskederScreen';
import { ProfilScreen } from './components/screens/ProfilScreen';
import { LoginScreen } from './components/screens/LoginScreen';
import { AdminPortalScreen } from './components/screens/AdminPortalScreen';
import { SygemeldingModal } from './components/modals/SygemeldingModal';
import { FerieModal } from './components/modals/FerieModal';
import { VagtbytteModal } from './components/modals/VagtbytteModal';
import { LønseddelModal } from './components/modals/LønseddelModal';
import { ManualTimeModal } from './components/modals/ManualTimeModal';
import { PhoneInstallModal } from './components/modals/PhoneInstallModal';
import { ToastContainer, ToastMessage } from './components/Toast';

export default function App() {
  // Authentication & Mode State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);

  // Employees List (Admin managed)
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);

  // Navigation & View
  const [currentTab, setCurrentTab] = useState<TabType>('oversigt');
  const [deviceMode, setDeviceMode] = useState<'mobile' | 'fullscreen'>('mobile');

  // Core App State
  const [userProfile, setUserProfile] = useState<UserProfile>(initialUserProfile);
  const [shifts, setShifts] = useState<Shift[]>(initialShifts);
  const [colleagues, setColleagues] = useState<Colleague[]>(initialColleagues);
  const [notices, setNotices] = useState<Notice[]>(initialNotices);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>(initialTimeEntries);
  const [channels, setChannels] = useState<Channel[]>(initialChannels);
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>(initialChatMessages);
  const [payslips] = useState<Payslip[]>(initialPayslips);

  // Punch Clock Live State
  const [isClockedIn, setIsClockedIn] = useState<boolean>(true);
  const [isOnBreak, setIsOnBreak] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(312); // ~5 min into the 14:30 shift
  const [clockInTimeFormatted, setClockInTimeFormatted] = useState<string>('14:28');

  // Modal states
  const [isSygemeldingOpen, setIsSygemeldingOpen] = useState(false);
  const [isFerieOpen, setIsFerieOpen] = useState(false);
  const [isVagtbytteOpen, setIsVagtbytteOpen] = useState(false);
  const [selectedSwapShift, setSelectedSwapShift] = useState<Shift | undefined>(undefined);
  const [activePayslip, setActivePayslip] = useState<Payslip | null>(null);
  const [isManualTimeOpen, setIsManualTimeOpen] = useState(false);
  const [isPhoneInstallOpen, setIsPhoneInstallOpen] = useState(false);

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', title: string, description?: string) => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts((prev) => [...prev, { id, type, title, description }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Timer interval for punch clock
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isClockedIn && !isOnBreak) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isClockedIn, isOnBreak]);

  // Format HH:MM:SS
  const formatElapsedTime = (secs: number) => {
    const hours = Math.floor(secs / 3600);
    const minutes = Math.floor((secs % 3600) / 60);
    const seconds = secs % 60;
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      seconds.toString().padStart(2, '0'),
    ].join(':');
  };

  // Authentication handlers
  const handleLoginSuccess = (credentials: { employeeId: string; name: string }, isAdmin?: boolean) => {
    setIsAuthenticated(true);
    if (isAdmin) {
      setIsAdminMode(true);
      addToast(
        'success',
        'Benvenuto nel Portale Direzione!',
        'Accesso eseguito come Amministratore di Portale Ristorante.'
      );
    } else {
      setIsAdminMode(false);
      addToast(
        'success',
        `Benvenuto, ${credentials.name}!`,
        'Accesso eseguito al Portale Dipendenti di Portale Ristorante.'
      );
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsAdminMode(false);
    setCurrentTab('oversigt');
    addToast('info', 'Disconnesso', 'Sei uscito dal portale aziendale.');
  };

  // Staff Management (Admin)
  const handleAddEmployee = (newEmp: Employee) => {
    setEmployees((prev) => [newEmp, ...prev]);
    // Also sync to colleagues roster
    const newColleague: Colleague = {
      id: newEmp.id,
      name: newEmp.name,
      role: newEmp.role,
      avatar: newEmp.avatar,
      phone: newEmp.phone,
      department: newEmp.department,
      status: 'fri',
    };
    setColleagues((prev) => [newColleague, ...prev]);
    addToast(
      'success',
      'Dipendente Registrato!',
      `${newEmp.name} (${newEmp.role}) è stato aggiunto all'organico di Portale Ristorante.`
    );
  };

  const handleRemoveEmployee = (id: string) => {
    setEmployees((prev) => prev.filter((e) => e.id !== id));
    setColleagues((prev) => prev.filter((c) => c.id !== id));
    addToast('info', 'Dipendente rimosso', "L'utente è stato rimosso dall'organico aziendale.");
  };

  const handleUpdateEmployeeStatus = (id: string, status: 'attivo' | 'ferie' | 'non_attivo') => {
    setEmployees((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status } : e))
    );
    addToast('info', 'Stato modificato', `Dipendente aggiornato in stato: ${status}.`);
  };

  // Punch clock actions with QR site verification
  const handleClockIn = (locationName?: string) => {
    setIsClockedIn(true);
    setIsOnBreak(false);
    const now = new Date();
    const formatted = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    setClockInTimeFormatted(formatted);
    const loc = locationName || 'Portale Ristorante - Sal & Servering';
    addToast(
      'success',
      'Stemplet ind på lokation',
      `Tjekket ind kl. ${formatted} på ${loc}.`
    );
  };

  const handleClockOut = (locationName?: string) => {
    setIsClockedIn(false);
    setIsOnBreak(false);
    const hoursWorked = (elapsedSeconds / 3600).toFixed(2);
    const loc = locationName || 'Portale Ristorante - Sal & Servering';
    // Add to daily timesheet
    const newEntry: TimeEntry = {
      id: 'entry-' + Date.now(),
      date: '03. nov 2026',
      dayName: 'Tirsdag (I dag)',
      checkIn: clockInTimeFormatted,
      checkOut: '14:35',
      breakDuration: isOnBreak ? '15 min' : '0 min',
      nettoHours: parseFloat(hoursWorked) || 0.1,
      approved: false,
      approvedBy: 'Afventer godkendelse',
      location: loc,
    };
    setTimeEntries((prev) => [newEntry, ...prev]);
    addToast(
      'info',
      'Stemplet ud for i dag',
      `Registrering for ${loc} er sendt til godkendelse.`
    );
  };

  const handleToggleBreak = () => {
    if (isOnBreak) {
      setIsOnBreak(false);
      addToast('success', 'Pause afsluttet', 'Arbejdstiden tæller videre.');
    } else {
      setIsOnBreak(true);
      addToast('info', 'Pause påbegyndt', 'Husk at stemple tilbage når pausen er slut.');
    }
  };

  // Claim open shift
  const handleClaimOpenShift = (shiftId: string) => {
    setShifts((prev) =>
      prev.map((s) =>
        s.id === shiftId
          ? { ...s, status: 'bekræftet', notes: 'Tildelt til dig med overenskomsttillæg' }
          : s
      )
    );
    addToast(
      'success',
      'Vagt tildelt!',
      'Ekstravagten er føjet til din vagtplan og medregnes i næste lønkørsel.'
    );
  };

  // Submit shift swap request
  const handleSubmitSwap = (shiftId: string, colleagueName: string, reason: string) => {
    setShifts((prev) =>
      prev.map((s) =>
        s.id === shiftId
          ? {
              ...s,
              status: 'bytte_tilbudt',
              swapRequestedWith: colleagueName,
              notes: `Bytteanmodning sendt: "${reason}"`,
            }
          : s
      )
    );
    addToast(
      'success',
      'Bytteanmodning sendt',
      `Forespørgsel sendt til ${colleagueName}.`
    );
  };

  // Submit sickness report
  const handleSubmitSygemelding = (details: { reason: string; duration: string; note: string }) => {
    // Mark today's shift as affected
    setShifts((prev) =>
      prev.map((s) =>
        s.id === 's-today' ? { ...s, status: 'gennemført', notes: `Sygemeldt: ${details.reason}` } : s
      )
    );
    setIsClockedIn(false);
    addToast(
      'info',
      'Sygemelding modtaget',
      `Din leder Jens Peter Hauge er underrettet. God bedring!`
    );
  };

  // Submit vacation application
  const handleSubmitFerie = (details: {
    type: string;
    startDate: string;
    endDate: string;
    daysCount: number;
    comment: string;
  }) => {
    setUserProfile((prev) => ({
      ...prev,
      vacationDaysLeft: Math.max(0, prev.vacationDaysLeft - details.daysCount),
    }));
    addToast(
      'success',
      'Ferieansøgning indsendt',
      `Periode ${details.startDate} – ${details.endDate} er sendt til godkendelse.`
    );
  };

  // Manual timesheet submit
  const handleManualTimeSubmit = (entry: {
    date: string;
    checkIn: string;
    checkOut: string;
    breakMin: number;
    note: string;
  }) => {
    const newEntry: TimeEntry = {
      id: 'manual-' + Date.now(),
      date: entry.date,
      dayName: 'Manuel korrektion',
      checkIn: entry.checkIn,
      checkOut: entry.checkOut,
      breakDuration: `${entry.breakMin} min`,
      nettoHours: 7.5,
      approved: false,
      approvedBy: 'Afventer leder',
      location: 'København Hub - Hal 4',
    };
    setTimeEntries((prev) => [newEntry, ...prev]);
    addToast('success', 'Tid registreret', 'Venter på godkendelse fra leder.');
  };

  // Send message in chat channel
  const handleSendMessage = (channelId: string, text: string) => {
    const newMsg: ChatMessage = {
      id: 'm-' + Date.now(),
      senderId: 'user',
      senderName: userProfile.name,
      senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      isMe: true,
      text,
      timestamp: 'Lige nu',
    };

    setChatMessages((prev) => ({
      ...prev,
      [channelId]: [...(prev[channelId] || []), newMsg],
    }));

    // Update channel last message
    setChannels((prev) =>
      prev.map((c) =>
        c.id === channelId
          ? { ...c, lastMessage: `${userProfile.name.split(' ')[0]}: ${text}`, lastTime: 'Nu' }
          : c
      )
    );

    // Simulate reply if talking to Freja or Team
    if (channelId === 'ch-freja') {
      setTimeout(() => {
        const replyMsg: ChatMessage = {
          id: 'm-reply-' + Date.now(),
          senderId: 'col-1',
          senderName: 'Freja Møller',
          senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
          isMe: false,
          text: 'Tak Mads, det passer mig perfekt. Jeg godkender i min app nu 👍',
          timestamp: 'Lige nu',
        };
        setChatMessages((prev) => ({
          ...prev,
          [channelId]: [...(prev[channelId] || []), replyMsg],
        }));
        setChannels((prev) =>
          prev.map((c) =>
            c.id === channelId
              ? { ...c, lastMessage: 'Freja: Tak Mads, det passer mig perfekt.', lastTime: 'Nu' }
              : c
          )
        );
      }, 1500);
    }
  };

  // Mark notice as read
  const handleReadNotice = (noticeId: string) => {
    setNotices((prev) =>
      prev.map((n) => (n.id === noticeId ? { ...n, read: true } : n))
    );
    addToast('info', 'Meddelelse bekræftet', 'Din læsekvittering er gemt.');
  };

  // Profile preferences
  const handleToggleBiometric = () => {
    setUserProfile((prev) => {
      const next = !prev.biometricEnabled;
      addToast(
        'info',
        next ? 'Biometri aktiveret' : 'Biometri deaktiveret',
        'Android sikkerhedsindstilling opdateret.'
      );
      return { ...prev, biometricEnabled: next };
    });
  };

  const handleToggleNotifications = () => {
    setUserProfile((prev) => {
      const next = !prev.notificationsEnabled;
      addToast(
        'info',
        next ? 'Notifikationer slået til' : 'Notifikationer slået fra',
        'Du modtager påmindelser før vagter.'
      );
      return { ...prev, notificationsEnabled: next };
    });
  };

  const openShiftsCount = shifts.filter((s) => s.status === 'ledig').length;
  const unreadMessagesCount = channels.reduce((acc, c) => acc + c.unreadCount, 0);

  return (
    <div className="relative">
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      <AndroidFrame
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        unreadMessagesCount={unreadMessagesCount}
        openShiftsCount={openShiftsCount}
        isClockedIn={isClockedIn}
        deviceMode={deviceMode}
        isAuthenticated={isAuthenticated}
        isAdminMode={isAdminMode}
        onToggleAdminMode={() => setIsAdminMode((prev) => !prev)}
        onOpenPhoneInstall={() => setIsPhoneInstallOpen(true)}
        onToggleDeviceMode={() =>
          setDeviceMode((prev) => (prev === 'mobile' ? 'fullscreen' : 'mobile'))
        }
      >
        {!isAuthenticated ? (
          <LoginScreen
            onLoginSuccess={handleLoginSuccess}
            onOpenPhoneInstall={() => setIsPhoneInstallOpen(true)}
          />
        ) : isAdminMode ? (
          <AdminPortalScreen
            employees={employees}
            shifts={shifts}
            onAddEmployee={handleAddEmployee}
            onRemoveEmployee={handleRemoveEmployee}
            onUpdateEmployeeStatus={handleUpdateEmployeeStatus}
            onSwitchToEmployeeView={() => setIsAdminMode(false)}
            onLogout={handleLogout}
          />
        ) : (
          <>
            {currentTab === 'oversigt' && (
              <OversigtScreen
                userProfile={userProfile}
                todayShift={shifts[0]}
                upcomingShifts={shifts}
                colleagues={colleagues}
                notices={notices}
                isClockedIn={isClockedIn}
                isOnBreak={isOnBreak}
                elapsedTimeString={formatElapsedTime(elapsedSeconds)}
                onClockToggle={() => (isClockedIn ? handleClockOut() : handleClockIn())}
                onOpenSygemelding={() => setIsSygemeldingOpen(true)}
                onOpenVagtbytte={() => {
                  setSelectedSwapShift(shifts[0]);
                  setIsVagtbytteOpen(true);
                }}
                onNavigateTab={setCurrentTab}
                onReadNotice={handleReadNotice}
              />
            )}

            {currentTab === 'vagter' && (
              <VagterScreen
                shifts={shifts}
                colleagues={colleagues}
                onClaimOpenShift={handleClaimOpenShift}
                onOpenSwapModal={(shift) => {
                  setSelectedSwapShift(shift || shifts[0]);
                  setIsVagtbytteOpen(true);
                }}
                onNotification={addToast}
              />
            )}

            {currentTab === 'stempelur' && (
              <StempelurScreen
                isClockedIn={isClockedIn}
                isOnBreak={isOnBreak}
                elapsedTimeString={formatElapsedTime(elapsedSeconds)}
                clockInTimeFormatted={clockInTimeFormatted}
                onClockIn={handleClockIn}
                onClockOut={handleClockOut}
                onToggleBreak={handleToggleBreak}
                timeEntries={timeEntries}
                onOpenManualModal={() => setIsManualTimeOpen(true)}
                onNotification={addToast}
              />
            )}

            {currentTab === 'beskeder' && (
              <BeskederScreen
                channels={channels}
                chatMessages={chatMessages}
                notices={notices}
                onSendMessage={handleSendMessage}
                onReadNotice={handleReadNotice}
              />
            )}

            {currentTab === 'profil' && (
              <ProfilScreen
                userProfile={userProfile}
                payslips={payslips}
                onOpenFerieModal={() => setIsFerieOpen(true)}
                onOpenSygemeldingModal={() => setIsSygemeldingOpen(true)}
                onSelectPayslip={(slip) => setActivePayslip(slip)}
                onToggleBiometric={handleToggleBiometric}
                onToggleNotifications={handleToggleNotifications}
                onLogout={handleLogout}
                onOpenAdminPortal={() => setIsAdminMode(true)}
                onOpenPhoneInstall={() => setIsPhoneInstallOpen(true)}
              />
            )}
          </>
        )}
      </AndroidFrame>

      {/* Modals */}
      <SygemeldingModal
        isOpen={isSygemeldingOpen}
        onClose={() => setIsSygemeldingOpen(false)}
        onSubmit={handleSubmitSygemelding}
      />

      <FerieModal
        isOpen={isFerieOpen}
        onClose={() => setIsFerieOpen(false)}
        userProfile={userProfile}
        onSubmit={handleSubmitFerie}
      />

      <VagtbytteModal
        isOpen={isVagtbytteOpen}
        onClose={() => setIsVagtbytteOpen(false)}
        myShifts={shifts.filter((s) => s.status !== 'ledig')}
        colleagues={colleagues}
        preselectedShift={selectedSwapShift}
        onSubmit={handleSubmitSwap}
      />

      {activePayslip && (
        <LønseddelModal
          isOpen={!!activePayslip}
          onClose={() => setActivePayslip(null)}
          payslip={activePayslip}
          userProfile={userProfile}
          onDownload={() => {
            addToast('success', 'Lønseddel hentet', 'PDF er gemt på din enhed.');
            setActivePayslip(null);
          }}
        />
      )}

      <ManualTimeModal
        isOpen={isManualTimeOpen}
        onClose={() => setIsManualTimeOpen(false)}
        onSubmit={handleManualTimeSubmit}
      />

      <PhoneInstallModal
        isOpen={isPhoneInstallOpen}
        onClose={() => setIsPhoneInstallOpen(false)}
      />
    </div>
  );
}
