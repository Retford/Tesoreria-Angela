import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { today } from '@/lib/format';
import { Plus } from 'lucide-react';

export default function MovementForm({ categorias, onAdd, onAddCategoria }) {
  const [fecha, setFecha] = useState(today());
  const [concepto, setConcepto] = useState('');
  const [categoria, setCategoria] = useState(categorias[0]);
  const [tipo, setTipo] = useState('Ingreso');
  const [importe, setImporte] = useState('');
  const [nuevaCat, setNuevaCat] = useState('');
  const [error, setError] = useState('');

  function handleAdd() {
    const monto = parseFloat(importe);
    if (!fecha || !concepto.trim() || isNaN(monto) || monto <= 0) {
      setError('Completa fecha, concepto e importe antes de añadir.');
      return;
    }
    setError('');
    onAdd({
      fecha,
      concepto: concepto.trim(),
      categoria: categoria || categorias[0],
      tipo,
      importe: monto,
    });
    setConcepto('');
    setImporte('');
  }

  function handleAddCategoria() {
    const val = nuevaCat.trim();
    if (!val) return;
    onAddCategoria(val);
    setCategoria(val);
    setNuevaCat('');
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nuevo movimiento</CardTitle>
      </CardHeader>
      <CardContent className='flex flex-col gap-4'>
        <div className='grid grid-cols-2 md:grid-cols-6 gap-3 items-end'>
          <div>
            <Label htmlFor='fecha'>Fecha</Label>
            <Input
              id='fecha'
              type='date'
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
          </div>
          <div className='col-span-2'>
            <Label htmlFor='concepto'>Concepto</Label>
            <Input
              id='concepto'
              placeholder='Cuota de socios - enero'
              value={concepto}
              onChange={(e) => setConcepto(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            />
          </div>
          <div>
            <Label>Categoría</Label>
            <Select value={categoria} onValueChange={setCategoria}>
              <SelectTrigger>
                <SelectValue placeholder='Categoría' />
              </SelectTrigger>
              <SelectContent>
                {categorias.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Tipo</Label>
            <Select value={tipo} onValueChange={setTipo}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='Ingreso'>Ingreso</SelectItem>
                <SelectItem value='Gasto'>Gasto</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className='flex gap-2'>
            <div className='flex-1'>
              <Label htmlFor='importe'>Importe (S/)</Label>
              <Input
                id='importe'
                type='number'
                step='0.01'
                placeholder='0.00'
                value={importe}
                onChange={(e) => setImporte(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              />
            </div>
          </div>
        </div>

        <Button onClick={handleAdd} className='w-fit'>
          <Plus className='h-4 w-4' /> Añadir movimiento
        </Button>

        {error && <p className='text-xs text-red-600'>{error}</p>}

        <div className='flex gap-2 pt-3 border-t border-line'>
          <Input
            placeholder='Añadir categoría nueva (p. ej. Cuota extraordinaria)'
            value={nuevaCat}
            onChange={(e) => setNuevaCat(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddCategoria()}
            className='max-w-sm'
          />
          <Button variant='outline' onClick={handleAddCategoria}>
            Añadir categoría
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
