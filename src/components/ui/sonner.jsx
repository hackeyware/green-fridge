import { Toaster as Sonner } from 'sonner';

function Toaster(props) {
  return <Sonner position="top-center" offset={16} {...props} />;
}

export { Toaster };
