# NFT Art Generator

Script that generates unique images from a collection of component attribute based on weight.


![](example/output.jpg) 

### Dependencies

- python3.7
- numpy
- opencv-python



## Usage
Component folder structure, the order of layers will be used for final image compositing.

layers/  
├─ 01_layer/  
│  ├─ file1.png  
│  ├─ file2.png  
│  ├─ file3.png  
│  ├─ ...  
├─ 02_layer/  
│  ├─ file4.png  
│  ├─ file5.png  
│  ├─ ...  
├─ 03_layer/  
│  ├─ file6.png  
│  ├─ ...  
├─ ...  

Specify arguments at generator.py top
```python
layers_folder = 'example\layers'
layers_map_path = 'example\\'
attribute_map_path = 'example\\'
total_art = 500
image_output_path = 'example\\outputs\\'
```


```python
import NFT Art Generator

# create a layers map in layers_map_path.
create_json()

# user need to edit layers_map.json in layers_map_path to put in the weight on each attribute.
# generate attributes for all the art, save as json file in attribute_map_path.
generate_att()

# generate image based on the  attribute_map.json
generate_art()
```

