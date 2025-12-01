interface SidebarBtnProps {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: string;
}

export default function SidebarBtn({ active, onClick, label, icon }: SidebarBtnProps) {
  return (
    <button 
      onClick={onClick} 
      className={`w-full text-left px-4 py-3 rounded-xl transition flex items-center gap-3 font-medium ${active ? 'bg-fun-bg text-fun-purple' : 'text-gray-500 hover:bg-gray-50'}`}
    >
      <span>{icon}</span>
      {label}
    </button>
  );
}