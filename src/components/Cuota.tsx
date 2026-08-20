interface Props {
  profession: string;
  cuota: number;
}

export const Cuota = ({ profession, cuota }: Props) => {
  return (
    <section className='flex bg-white p-4 rounded-xl shadow-sm border border-line'>
      <div className='font-medium'>Cuota para {profession}:&nbsp;&nbsp;</div>
      <span className='font-bold text-green-500'>{cuota} S/.</span>
    </section>
  );
};
