import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import db from "@/db/db"
import { formatCurrency } from "@/lib/formatters"
import { PageHeader } from "../_components/PageHeader"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CheckCircle2, MoreVertical, XCircle } from "lucide-react"
import { ShippingNumberDropDownItem, DeleteDropDownItem } from "./_components/OrderActions"

function getOrders() {
  return db.order.findMany({
    select: {
      id: true,
      pricePaidInCents: true,
      size: true,
      quantity: true,
      shippingNumber: true,
      product: { select: { name: true, collection: { select: { name: true } }} },
      user: { select: { email: true } },
    },
    orderBy: { createdAt: "desc" },
  })
}

export default function OrdersPage() {
  return (
    <>
      <PageHeader>Orders</PageHeader>
      <OrdersTable />
    </>
  )
}

async function OrdersTable() {
  const orders = await getOrders()

  if (orders.length === 0) return <p>No orders found</p>

  return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Done</TableHead>
					<TableHead>Product</TableHead>
					<TableHead>Customer</TableHead>
					<TableHead>Price Paid</TableHead>
					<TableHead>Shipping N.</TableHead>
					<TableHead>Size</TableHead>
					<TableHead>Quantity</TableHead>
					<TableHead className='w-0'>
						<span className='sr-only'>Actions</span>
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{orders.map((order) => (
					<TableRow key={order.id}>
						<TableCell>
							{order.shippingNumber ? (
								<>
									<span className='sr-only'>Available</span>
									<CheckCircle2 />
								</>
							) : (
								<>
									<span className='sr-only'>Unavailable</span>
									<XCircle className='stroke-destructive' />
								</>
							)}
						</TableCell>
						<TableCell>
							{order.product.collection?.name} {order.product.name}
						</TableCell>
						<TableCell>{order.user.email}</TableCell>
						<TableCell>
							{formatCurrency(order.pricePaidInCents / 100)}
						</TableCell>
						<TableCell>{order.shippingNumber}</TableCell>
						<TableCell>{order.size}</TableCell>
						<TableCell>{order.quantity}</TableCell>
						<TableCell className='text-center'>
							<DropdownMenu>
								<DropdownMenuTrigger>
									<MoreVertical />
									<span className='sr-only'>Actions</span>
								</DropdownMenuTrigger>
								<DropdownMenuContent>
									<ShippingNumberDropDownItem
										id={order.id}
										shippingNumber={order.shippingNumber}
										email={order.user.email}
									/>
									<DeleteDropDownItem id={order.id} />
								</DropdownMenuContent>
							</DropdownMenu>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
  );
}
