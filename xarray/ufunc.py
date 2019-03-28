import numpy as np
import xarray as xr

da = xr.DataArray(np.random.rand(1000, 100))
da = da.rename({'dim_0': 'rows_a'})
db = xr.DataArray(np.random.rand(1000, 100))
db = db.rename({'dim_0': 'rows_b'})

def print_shape(a):
    print(a.shape)
    return np.zeros(shape=(a.shape[0]))

def print_two_shapes(a, b):
    print(a.shape)
    print(b.shape)
    return np.zeros(shape=(a.shape[0], b.shape[0]))

print('\nprint_shape')
xr.apply_ufunc(
    print_shape,
    da,
    input_core_dims=[['dim_1']]
)

print('\nprint_two_shapes')
xr.apply_ufunc(
    print_two_shapes,
    da, db,
    input_core_dims=[['dim_1'], ['dim_1']]
)
