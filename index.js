const express = require('express');
const Replicate = require('replicate');
const app = express();
app.use(express.json({ limit: '10mb' }));

const replicate = new Replicate({ auth: "r8_VZyhjiEZJn90hY9vyilrH3jgpZTRGdN1GvjcN"});

app.post('/generate-icon', async (req, res) => {
    try {
        const { ref_image_base64, target_image_base64, prompt } = req.body;

        // Using the IP-Adapter model which is perfect for Style Transfer
        const output = await replicate.run(
            "lucataco/ip-adapter-sdxl:c8ccd3f0190af370333a0da2abc91206e338505fa7f20546128fa4566b96795b",
            {
                input: {
                    image: target_image_base64,          // The Subject
                    ip_adapter_image: ref_image_base64, // The Style
                    prompt: prompt,
                    num_inference_steps: 30
                }
            }
        );

        res.json({ image_url: output[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => console.log('Backend running on port 3000'));
