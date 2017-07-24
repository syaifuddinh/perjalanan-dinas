<div class="row-fluid">
<button class="btn btn-success pull-right" id="bt-hitung"><i class="icon-money"></i>&nbsp;Hitung</button>
<form action="#"  method="post" id="entri" name="form-nilai" class="form-horizontal">
<input type="hidden" id="id_pelaksana" name="id_pelaksana" value="<?php echo $_GET['p']?>">
<input type="hidden" id="status" name="status" value="1">
<table class="table table-striped table-hover fill-head">
	<thead>
		<tr>
			<th>Item Biaya</th>
			<th>Qty</th>
			<th>Harga</th>
			<th>Jumlah</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td width="20%">Uang Harian</td>
			<td ><div id="jml_harian" class="qty harian"></td>
			<td ><div id="harga_harian" class="cur harian"></div></td>
			<td ><div id="total_harian" class="cur total"></div></td>
		</tr>
		<tr>
			<td width="20%">Penginapan</td>
			<td ><div id="jml_inap" class="qty inap"></td>
			<td ><div id="harga_inap" class="cur inap"></div></td>
			<td ><div id="total_inap" class="cur total"></div></td>
		</tr>
		<tr>
			<td width="20%" colspan="2">Tiket Pergi</td>
			<td ><div id="tiket_pergi" class="cur trans"></div></td>
			<td></td>
		</tr>
		<tr>
			<td width="20%" colspan="2">Tiket Pulang</td>
			<td ><div id="tiket_pulang" class="cur trans"></div></td>
			<td></td>
		</tr>
		<tr>
			<td width="20%" colspan="2">Tax kota asal</td>
			<td ><div id="tax_asal" class="cur trans"></div></td>
			<td></td>
		</tr>
		<tr>
			<td width="20%" colspan="2">Tax kota tujuan</td>
			<td ><div id="tax_tujuan" class="cur trans"></div></td>
			<td></td>
		</tr>
		<tr>
			<td width="20%" colspan="2">Transport di kota asal</td>
			<td ><div id="transport_asal" class="cur trans"></div></td>
			<td></td>
		</tr>
		<tr>
			<td width="20%" colspan="2">Transport di kota tujuan</td>
			<td ><div id="transport_tujuan" class="cur trans"></div></td>
			<td></td>
		</tr>
		<tr>
			<td width="20%" colspan="3">Total transport</td>
			<td ><div id="total_transport" class="cur total"></div></td>
			
		</tr>
		<tr>
			<td colspan="3"><strong>Total seluruhnya</strong></td>
			<td ><div id="total_biaya" class="cur"></div></td>
		</tr>
		<tr>
			<td colspan="3"><strong>Yang sudah dibayar (kasbon)</strong></td>
			<td ><div id="total_kasbon" class="cur total"></div></td>
		</tr>
		<tr>
			<td colspan="3"><strong>Sisa</strong></td>
			<td ><div id="sisa_bayar" class="cur"></div></td>
		</tr>
	</tbody>
</table>            	

            	
                <div class="form-actions">
					<input type="submit" class="btn btn-primary" value="Save">
				</div>
                </form>   	
</div>