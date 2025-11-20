import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { WATCHLIST_TABLE_HEADER } from '@/lib/constants';

const sampleData = [
    {
        company: 'Apple Inc.',
        symbol: 'AAPL',
        price: '$175.43',
        change: '+2.34%',
        marketCap: '$2.75T',
        peRatio: '28.5',
        alert: 'Active',
        action: 'Remove',
    },
    {
        company: 'Microsoft Corporation',
        symbol: 'MSFT',
        price: '$378.91',
        change: '+1.12%',
        marketCap: '$2.81T',
        peRatio: '35.2',
        alert: 'None',
        action: 'Remove',
    },
    {
        company: 'Tesla Inc.',
        symbol: 'TSLA',
        price: '$242.84',
        change: '-0.87%',
        marketCap: '$771.2B',
        peRatio: '76.8',
        alert: 'Active',
        action: 'Remove',
    },
    {
        company: 'NVIDIA Corporation',
        symbol: 'NVDA',
        price: '$495.22',
        change: '+3.45%',
        marketCap: '$1.22T',
        peRatio: '68.3',
        alert: 'None',
        action: 'Remove',
    },
    {
        company: 'Amazon.com Inc.',
        symbol: 'AMZN',
        price: '$178.35',
        change: '+0.92%',
        marketCap: '$1.85T',
        peRatio: '52.1',
        alert: 'Active',
        action: 'Remove',
    },
];

export default function WatchlistTable() {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    {WATCHLIST_TABLE_HEADER.map((header) => (
                        <TableHead key={header} className="text-left">
                            {header}
                        </TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {sampleData.map((row, index) => (
                    <TableRow key={index}>
                        <TableCell className="text-left">{row.company}</TableCell>
                        <TableCell className="text-left">{row.symbol}</TableCell>
                        <TableCell className="text-left">{row.price}</TableCell>
                        <TableCell className="text-left">{row.change}</TableCell>
                        <TableCell className="text-left">{row.marketCap}</TableCell>
                        <TableCell className="text-left">{row.peRatio}</TableCell>
                        <TableCell className="text-left">{row.alert}</TableCell>
                        <TableCell className="text-left">{row.action}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
